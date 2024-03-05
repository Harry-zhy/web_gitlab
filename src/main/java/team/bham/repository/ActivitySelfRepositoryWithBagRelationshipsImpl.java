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
import team.bham.domain.ActivitySelf;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ActivitySelfRepositoryWithBagRelationshipsImpl implements ActivitySelfRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ActivitySelf> fetchBagRelationships(Optional<ActivitySelf> activitySelf) {
        return activitySelf.map(this::fetchActivitySaveds);
    }

    @Override
    public Page<ActivitySelf> fetchBagRelationships(Page<ActivitySelf> activitySelves) {
        return new PageImpl<>(
            fetchBagRelationships(activitySelves.getContent()),
            activitySelves.getPageable(),
            activitySelves.getTotalElements()
        );
    }

    @Override
    public List<ActivitySelf> fetchBagRelationships(List<ActivitySelf> activitySelves) {
        return Optional.of(activitySelves).map(this::fetchActivitySaveds).orElse(Collections.emptyList());
    }

    ActivitySelf fetchActivitySaveds(ActivitySelf result) {
        return entityManager
            .createQuery(
                "select activitySelf from ActivitySelf activitySelf left join fetch activitySelf.activitySaveds where activitySelf is :activitySelf",
                ActivitySelf.class
            )
            .setParameter("activitySelf", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<ActivitySelf> fetchActivitySaveds(List<ActivitySelf> activitySelves) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, activitySelves.size()).forEach(index -> order.put(activitySelves.get(index).getId(), index));
        List<ActivitySelf> result = entityManager
            .createQuery(
                "select distinct activitySelf from ActivitySelf activitySelf left join fetch activitySelf.activitySaveds where activitySelf in :activitySelves",
                ActivitySelf.class
            )
            .setParameter("activitySelves", activitySelves)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
