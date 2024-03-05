package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.EventItinerary;

/**
 * Spring Data JPA repository for the EventItinerary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventItineraryRepository extends JpaRepository<EventItinerary, Long> {}
