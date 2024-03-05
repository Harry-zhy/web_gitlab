package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ActivitySaved;

/**
 * Spring Data JPA repository for the ActivitySaved entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivitySavedRepository extends JpaRepository<ActivitySaved, Long> {}
