package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.MCQOption;

/**
 * Spring Data JPA repository for the MCQOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MCQOptionRepository extends JpaRepository<MCQOption, Long> {}
