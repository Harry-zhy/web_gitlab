package team.bham.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.FavouritesList;

/**
 * Spring Data JPA repository for the FavouritesList entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FavouritesListRepository extends JpaRepository<FavouritesList, Long> {}
