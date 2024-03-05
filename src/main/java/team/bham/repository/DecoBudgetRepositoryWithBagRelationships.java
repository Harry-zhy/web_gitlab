package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.DecoBudget;

public interface DecoBudgetRepositoryWithBagRelationships {
    Optional<DecoBudget> fetchBagRelationships(Optional<DecoBudget> decoBudget);

    List<DecoBudget> fetchBagRelationships(List<DecoBudget> decoBudgets);

    Page<DecoBudget> fetchBagRelationships(Page<DecoBudget> decoBudgets);
}
