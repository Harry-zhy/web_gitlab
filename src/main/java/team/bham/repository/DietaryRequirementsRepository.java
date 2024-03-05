package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.DietaryRequirements;

/**
 * Spring Data JPA repository for the DietaryRequirements entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DietaryRequirementsRepository extends JpaRepository<DietaryRequirements, Long> {}
