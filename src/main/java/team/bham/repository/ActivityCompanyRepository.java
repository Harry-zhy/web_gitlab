package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ActivityCompany;

/**
 * Spring Data JPA repository for the ActivityCompany entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivityCompanyRepository extends JpaRepository<ActivityCompany, Long> {}
