package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.FavouritesListItem;

/**
 * Spring Data JPA repository for the FavouritesListItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FavouritesListItemRepository extends JpaRepository<FavouritesListItem, Long> {}
