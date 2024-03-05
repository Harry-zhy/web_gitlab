package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.DecoThemes;

public interface DecoThemesRepositoryWithBagRelationships {
    Optional<DecoThemes> fetchBagRelationships(Optional<DecoThemes> decoThemes);

    List<DecoThemes> fetchBagRelationships(List<DecoThemes> decoThemes);

    Page<DecoThemes> fetchBagRelationships(Page<DecoThemes> decoThemes);
}
