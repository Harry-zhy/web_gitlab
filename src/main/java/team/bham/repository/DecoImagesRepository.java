package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.DecoImages;

/**
 * Spring Data JPA repository for the DecoImages entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DecoImagesRepository extends JpaRepository<DecoImages, Long> {}
