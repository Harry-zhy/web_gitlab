package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class FavouritesListTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FavouritesList.class);
        FavouritesList favouritesList1 = new FavouritesList();
        favouritesList1.setId(1L);
        FavouritesList favouritesList2 = new FavouritesList();
        favouritesList2.setId(favouritesList1.getId());
        assertThat(favouritesList1).isEqualTo(favouritesList2);
        favouritesList2.setId(2L);
        assertThat(favouritesList1).isNotEqualTo(favouritesList2);
        favouritesList1.setId(null);
        assertThat(favouritesList1).isNotEqualTo(favouritesList2);
    }
}
