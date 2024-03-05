package team.bham.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import team.bham.domain.ItineraryGuest;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ItineraryGuestRepositoryWithBagRelationshipsImpl implements ItineraryGuestRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ItineraryGuest> fetchBagRelationships(Optional<ItineraryGuest> itineraryGuest) {
        return itineraryGuest.map(this::fetchEventItineraries);
    }

    @Override
    public Page<ItineraryGuest> fetchBagRelationships(Page<ItineraryGuest> itineraryGuests) {
        return new PageImpl<>(
            fetchBagRelationships(itineraryGuests.getContent()),
            itineraryGuests.getPageable(),
            itineraryGuests.getTotalElements()
        );
    }

    @Override
    public List<ItineraryGuest> fetchBagRelationships(List<ItineraryGuest> itineraryGuests) {
        return Optional.of(itineraryGuests).map(this::fetchEventItineraries).orElse(Collections.emptyList());
    }

    ItineraryGuest fetchEventItineraries(ItineraryGuest result) {
        return entityManager
            .createQuery(
                "select itineraryGuest from ItineraryGuest itineraryGuest left join fetch itineraryGuest.eventItineraries where itineraryGuest is :itineraryGuest",
                ItineraryGuest.class
            )
            .setParameter("itineraryGuest", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<ItineraryGuest> fetchEventItineraries(List<ItineraryGuest> itineraryGuests) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, itineraryGuests.size()).forEach(index -> order.put(itineraryGuests.get(index).getId(), index));
        List<ItineraryGuest> result = entityManager
            .createQuery(
                "select distinct itineraryGuest from ItineraryGuest itineraryGuest left join fetch itineraryGuest.eventItineraries where itineraryGuest in :itineraryGuests",
                ItineraryGuest.class
            )
            .setParameter("itineraryGuests", itineraryGuests)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
