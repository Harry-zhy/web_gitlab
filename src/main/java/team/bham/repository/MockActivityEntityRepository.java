package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MockActivityEntity;

/**
 * Spring Data JPA repository for the MockActivityEntity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MockActivityEntityRepository extends JpaRepository<MockActivityEntity, Long> {}
