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
import team.bham.domain.DecoThemes;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class DecoThemesRepositoryWithBagRelationshipsImpl implements DecoThemesRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<DecoThemes> fetchBagRelationships(Optional<DecoThemes> decoThemes) {
        return decoThemes.map(this::fetchDecoSavedThemes);
    }

    @Override
    public Page<DecoThemes> fetchBagRelationships(Page<DecoThemes> decoThemes) {
        return new PageImpl<>(fetchBagRelationships(decoThemes.getContent()), decoThemes.getPageable(), decoThemes.getTotalElements());
    }

    @Override
    public List<DecoThemes> fetchBagRelationships(List<DecoThemes> decoThemes) {
        return Optional.of(decoThemes).map(this::fetchDecoSavedThemes).orElse(Collections.emptyList());
    }

    DecoThemes fetchDecoSavedThemes(DecoThemes result) {
        return entityManager
            .createQuery(
                "select decoThemes from DecoThemes decoThemes left join fetch decoThemes.decoSavedThemes where decoThemes is :decoThemes",
                DecoThemes.class
            )
            .setParameter("decoThemes", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<DecoThemes> fetchDecoSavedThemes(List<DecoThemes> decoThemes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, decoThemes.size()).forEach(index -> order.put(decoThemes.get(index).getId(), index));
        List<DecoThemes> result = entityManager
            .createQuery(
                "select distinct decoThemes from DecoThemes decoThemes left join fetch decoThemes.decoSavedThemes where decoThemes in :decoThemes",
                DecoThemes.class
            )
            .setParameter("decoThemes", decoThemes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
