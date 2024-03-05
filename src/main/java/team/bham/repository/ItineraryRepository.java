package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Itinerary;

/**
 * Spring Data JPA repository for the Itinerary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {}
