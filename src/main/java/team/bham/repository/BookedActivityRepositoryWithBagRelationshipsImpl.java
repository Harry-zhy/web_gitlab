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
import team.bham.domain.BookedActivity;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class BookedActivityRepositoryWithBagRelationshipsImpl implements BookedActivityRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<BookedActivity> fetchBagRelationships(Optional<BookedActivity> bookedActivity) {
        return bookedActivity.map(this::fetchActivitySaveds);
    }

    @Override
    public Page<BookedActivity> fetchBagRelationships(Page<BookedActivity> bookedActivities) {
        return new PageImpl<>(
            fetchBagRelationships(bookedActivities.getContent()),
            bookedActivities.getPageable(),
            bookedActivities.getTotalElements()
        );
    }

    @Override
    public List<BookedActivity> fetchBagRelationships(List<BookedActivity> bookedActivities) {
        return Optional.of(bookedActivities).map(this::fetchActivitySaveds).orElse(Collections.emptyList());
    }

    BookedActivity fetchActivitySaveds(BookedActivity result) {
        return entityManager
            .createQuery(
                "select bookedActivity from BookedActivity bookedActivity left join fetch bookedActivity.activitySaveds where bookedActivity is :bookedActivity",
                BookedActivity.class
            )
            .setParameter("bookedActivity", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<BookedActivity> fetchActivitySaveds(List<BookedActivity> bookedActivities) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, bookedActivities.size()).forEach(index -> order.put(bookedActivities.get(index).getId(), index));
        List<BookedActivity> result = entityManager
            .createQuery(
                "select distinct bookedActivity from BookedActivity bookedActivity left join fetch bookedActivity.activitySaveds where bookedActivity in :bookedActivities",
                BookedActivity.class
            )
            .setParameter("bookedActivities", bookedActivities)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
