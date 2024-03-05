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
import team.bham.domain.DecoCompany;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class DecoCompanyRepositoryWithBagRelationshipsImpl implements DecoCompanyRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<DecoCompany> fetchBagRelationships(Optional<DecoCompany> decoCompany) {
        return decoCompany.map(this::fetchDecoSavedCompanies);
    }

    @Override
    public Page<DecoCompany> fetchBagRelationships(Page<DecoCompany> decoCompanies) {
        return new PageImpl<>(
            fetchBagRelationships(decoCompanies.getContent()),
            decoCompanies.getPageable(),
            decoCompanies.getTotalElements()
        );
    }

    @Override
    public List<DecoCompany> fetchBagRelationships(List<DecoCompany> decoCompanies) {
        return Optional.of(decoCompanies).map(this::fetchDecoSavedCompanies).orElse(Collections.emptyList());
    }

    DecoCompany fetchDecoSavedCompanies(DecoCompany result) {
        return entityManager
            .createQuery(
                "select decoCompany from DecoCompany decoCompany left join fetch decoCompany.decoSavedCompanies where decoCompany is :decoCompany",
                DecoCompany.class
            )
            .setParameter("decoCompany", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<DecoCompany> fetchDecoSavedCompanies(List<DecoCompany> decoCompanies) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, decoCompanies.size()).forEach(index -> order.put(decoCompanies.get(index).getId(), index));
        List<DecoCompany> result = entityManager
            .createQuery(
                "select distinct decoCompany from DecoCompany decoCompany left join fetch decoCompany.decoSavedCompanies where decoCompany in :decoCompanies",
                DecoCompany.class
            )
            .setParameter("decoCompanies", decoCompanies)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
