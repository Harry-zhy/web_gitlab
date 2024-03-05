package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.OneFeedback;

/**
 * Spring Data JPA repository for the OneFeedback entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OneFeedbackRepository extends JpaRepository<OneFeedback, Long> {}
