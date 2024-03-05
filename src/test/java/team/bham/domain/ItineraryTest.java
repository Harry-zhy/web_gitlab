package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ItineraryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Itinerary.class);
        Itinerary itinerary1 = new Itinerary();
        itinerary1.setId(1L);
        Itinerary itinerary2 = new Itinerary();
        itinerary2.setId(itinerary1.getId());
        assertThat(itinerary1).isEqualTo(itinerary2);
        itinerary2.setId(2L);
        assertThat(itinerary1).isNotEqualTo(itinerary2);
        itinerary1.setId(null);
        assertThat(itinerary1).isNotEqualTo(itinerary2);
    }
}
