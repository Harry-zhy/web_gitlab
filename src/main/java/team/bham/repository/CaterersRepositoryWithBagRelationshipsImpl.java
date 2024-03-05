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
import team.bham.domain.Caterers;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class CaterersRepositoryWithBagRelationshipsImpl implements CaterersRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Caterers> fetchBagRelationships(Optional<Caterers> caterers) {
        return caterers.map(this::fetchDietaryRequirements).map(this::fetchCuisines);
    }

    @Override
    public Page<Caterers> fetchBagRelationships(Page<Caterers> caterers) {
        return new PageImpl<>(fetchBagRelationships(caterers.getContent()), caterers.getPageable(), caterers.getTotalElements());
    }

    @Override
    public List<Caterers> fetchBagRelationships(List<Caterers> caterers) {
        return Optional.of(caterers).map(this::fetchDietaryRequirements).map(this::fetchCuisines).orElse(Collections.emptyList());
    }

    Caterers fetchDietaryRequirements(Caterers result) {
        return entityManager
            .createQuery(
                "select caterers from Caterers caterers left join fetch caterers.dietaryRequirements where caterers is :caterers",
                Caterers.class
            )
            .setParameter("caterers", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Caterers> fetchDietaryRequirements(List<Caterers> caterers) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, caterers.size()).forEach(index -> order.put(caterers.get(index).getId(), index));
        List<Caterers> result = entityManager
            .createQuery(
                "select distinct caterers from Caterers caterers left join fetch caterers.dietaryRequirements where caterers in :caterers",
                Caterers.class
            )
            .setParameter("caterers", caterers)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Caterers fetchCuisines(Caterers result) {
        return entityManager
            .createQuery(
                "select caterers from Caterers caterers left join fetch caterers.cuisines where caterers is :caterers",
                Caterers.class
            )
            .setParameter("caterers", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Caterers> fetchCuisines(List<Caterers> caterers) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, caterers.size()).forEach(index -> order.put(caterers.get(index).getId(), index));
        List<Caterers> result = entityManager
            .createQuery(
                "select distinct caterers from Caterers caterers left join fetch caterers.cuisines where caterers in :caterers",
                Caterers.class
            )
            .setParameter("caterers", caterers)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
