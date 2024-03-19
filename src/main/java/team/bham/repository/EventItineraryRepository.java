package team.bham.repository;

import java.time.ZonedDateTime;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.EventItinerary;
import team.bham.domain.ItineraryDateTime;

/**
 * Spring Data JPA repository for the EventItinerary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventItineraryRepository extends JpaRepository<EventItinerary, Long> {
    void EventDate(ItineraryDateTime eventStartTime);
}
