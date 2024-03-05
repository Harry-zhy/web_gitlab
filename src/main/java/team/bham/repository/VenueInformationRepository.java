package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.VenueInformation;

/**
 * Spring Data JPA repository for the VenueInformation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VenueInformationRepository extends JpaRepository<VenueInformation, Long> {}
