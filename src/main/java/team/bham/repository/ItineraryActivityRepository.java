package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ItineraryActivity;

/**
 * Spring Data JPA repository for the ItineraryActivity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItineraryActivityRepository extends JpaRepository<ItineraryActivity, Long> {}
