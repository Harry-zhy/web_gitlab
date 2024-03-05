package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.ItineraryGuest;

public interface ItineraryGuestRepositoryWithBagRelationships {
    Optional<ItineraryGuest> fetchBagRelationships(Optional<ItineraryGuest> itineraryGuest);

    List<ItineraryGuest> fetchBagRelationships(List<ItineraryGuest> itineraryGuests);

    Page<ItineraryGuest> fetchBagRelationships(Page<ItineraryGuest> itineraryGuests);
}
