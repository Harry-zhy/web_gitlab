package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MockVenueEntity;

/**
 * Spring Data JPA repository for the MockVenueEntity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MockVenueEntityRepository extends JpaRepository<MockVenueEntity, Long> {}
