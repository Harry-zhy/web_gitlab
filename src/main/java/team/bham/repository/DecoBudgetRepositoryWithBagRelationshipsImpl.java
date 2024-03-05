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
import team.bham.domain.DecoBudget;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class DecoBudgetRepositoryWithBagRelationshipsImpl implements DecoBudgetRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<DecoBudget> fetchBagRelationships(Optional<DecoBudget> decoBudget) {
        return decoBudget.map(this::fetchDecoCompanies);
    }

    @Override
    public Page<DecoBudget> fetchBagRelationships(Page<DecoBudget> decoBudgets) {
        return new PageImpl<>(fetchBagRelationships(decoBudgets.getContent()), decoBudgets.getPageable(), decoBudgets.getTotalElements());
    }

    @Override
    public List<DecoBudget> fetchBagRelationships(List<DecoBudget> decoBudgets) {
        return Optional.of(decoBudgets).map(this::fetchDecoCompanies).orElse(Collections.emptyList());
    }

    DecoBudget fetchDecoCompanies(DecoBudget result) {
        return entityManager
            .createQuery(
                "select decoBudget from DecoBudget decoBudget left join fetch decoBudget.decoCompanies where decoBudget is :decoBudget",
                DecoBudget.class
            )
            .setParameter("decoBudget", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<DecoBudget> fetchDecoCompanies(List<DecoBudget> decoBudgets) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, decoBudgets.size()).forEach(index -> order.put(decoBudgets.get(index).getId(), index));
        List<DecoBudget> result = entityManager
            .createQuery(
                "select distinct decoBudget from DecoBudget decoBudget left join fetch decoBudget.decoCompanies where decoBudget in :decoBudgets",
                DecoBudget.class
            )
            .setParameter("decoBudgets", decoBudgets)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
