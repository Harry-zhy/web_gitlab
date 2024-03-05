package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ActivityImage;

/**
 * Spring Data JPA repository for the ActivityImage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivityImageRepository extends JpaRepository<ActivityImage, Long> {}
