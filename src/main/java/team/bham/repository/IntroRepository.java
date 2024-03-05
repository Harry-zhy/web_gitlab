package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Intro;

/**
 * Spring Data JPA repository for the Intro entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IntroRepository extends JpaRepository<Intro, Long> {}
