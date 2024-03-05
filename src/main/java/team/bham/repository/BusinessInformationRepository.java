package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.BusinessInformation;

/**
 * Spring Data JPA repository for the BusinessInformation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusinessInformationRepository extends JpaRepository<BusinessInformation, Long> {}
