package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ActivityContactDetails;

/**
 * Spring Data JPA repository for the ActivityContactDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivityContactDetailsRepository extends JpaRepository<ActivityContactDetails, Long> {}
