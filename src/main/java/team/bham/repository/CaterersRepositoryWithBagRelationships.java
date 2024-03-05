package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.Caterers;

public interface CaterersRepositoryWithBagRelationships {
    Optional<Caterers> fetchBagRelationships(Optional<Caterers> caterers);

    List<Caterers> fetchBagRelationships(List<Caterers> caterers);

    Page<Caterers> fetchBagRelationships(Page<Caterers> caterers);
}
