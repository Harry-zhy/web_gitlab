package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.ActivityIdea;

/**
 * Spring Data JPA repository for the ActivityIdea entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ActivityIdeaRepository extends JpaRepository<ActivityIdea, Long> {}
