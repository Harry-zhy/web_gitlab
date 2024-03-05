package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ItineraryDateTime;

/**
 * Spring Data JPA repository for the ItineraryDateTime entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItineraryDateTimeRepository extends JpaRepository<ItineraryDateTime, Long> {}
