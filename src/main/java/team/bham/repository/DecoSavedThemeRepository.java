package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.DecoSavedTheme;

/**
 * Spring Data JPA repository for the DecoSavedTheme entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DecoSavedThemeRepository extends JpaRepository<DecoSavedTheme, Long> {}
