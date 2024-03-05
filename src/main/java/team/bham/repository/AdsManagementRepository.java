package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.AdsManagement;

/**
 * Spring Data JPA repository for the AdsManagement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdsManagementRepository extends JpaRepository<AdsManagement, Long> {}
