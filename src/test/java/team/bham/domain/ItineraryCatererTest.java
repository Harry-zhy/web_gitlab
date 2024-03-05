package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ItineraryCatererTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItineraryCaterer.class);
        ItineraryCaterer itineraryCaterer1 = new ItineraryCaterer();
        itineraryCaterer1.setId(1L);
        ItineraryCaterer itineraryCaterer2 = new ItineraryCaterer();
        itineraryCaterer2.setId(itineraryCaterer1.getId());
        assertThat(itineraryCaterer1).isEqualTo(itineraryCaterer2);
        itineraryCaterer2.setId(2L);
        assertThat(itineraryCaterer1).isNotEqualTo(itineraryCaterer2);
        itineraryCaterer1.setId(null);
        assertThat(itineraryCaterer1).isNotEqualTo(itineraryCaterer2);
    }
}
