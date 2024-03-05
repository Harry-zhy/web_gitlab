package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ItineraryVenue;

/**
 * Spring Data JPA repository for the ItineraryVenue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItineraryVenueRepository extends JpaRepository<ItineraryVenue, Long> {}
