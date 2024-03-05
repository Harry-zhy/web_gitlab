package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Feedbacks;

/**
 * Spring Data JPA repository for the Feedbacks entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FeedbacksRepository extends JpaRepository<Feedbacks, Long> {}
