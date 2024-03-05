package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class FavouritesListItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FavouritesListItem.class);
        FavouritesListItem favouritesListItem1 = new FavouritesListItem();
        favouritesListItem1.setId(1L);
        FavouritesListItem favouritesListItem2 = new FavouritesListItem();
        favouritesListItem2.setId(favouritesListItem1.getId());
        assertThat(favouritesListItem1).isEqualTo(favouritesListItem2);
        favouritesListItem2.setId(2L);
        assertThat(favouritesListItem1).isNotEqualTo(favouritesListItem2);
        favouritesListItem1.setId(null);
        assertThat(favouritesListItem1).isNotEqualTo(favouritesListItem2);
    }
}
