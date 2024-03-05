package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.DecoContactDetails;

/**
 * Spring Data JPA repository for the DecoContactDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DecoContactDetailsRepository extends JpaRepository<DecoContactDetails, Long> {}
