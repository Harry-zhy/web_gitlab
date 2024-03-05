package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.DecoSavedCompany;

/**
 * Spring Data JPA repository for the DecoSavedCompany entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DecoSavedCompanyRepository extends JpaRepository<DecoSavedCompany, Long> {}
