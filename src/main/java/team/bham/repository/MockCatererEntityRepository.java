package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MockCatererEntity;

/**
 * Spring Data JPA repository for the MockCatererEntity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MockCatererEntityRepository extends JpaRepository<MockCatererEntity, Long> {}
