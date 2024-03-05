package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.BookedCaterer;

/**
 * Spring Data JPA repository for the BookedCaterer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BookedCatererRepository extends JpaRepository<BookedCaterer, Long> {}
