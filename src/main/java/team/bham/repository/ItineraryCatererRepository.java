package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ItineraryCaterer;

/**
 * Spring Data JPA repository for the ItineraryCaterer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItineraryCatererRepository extends JpaRepository<ItineraryCaterer, Long> {}
