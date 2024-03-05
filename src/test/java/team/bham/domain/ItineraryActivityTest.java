package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ItineraryActivityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItineraryActivity.class);
        ItineraryActivity itineraryActivity1 = new ItineraryActivity();
        itineraryActivity1.setId(1L);
        ItineraryActivity itineraryActivity2 = new ItineraryActivity();
        itineraryActivity2.setId(itineraryActivity1.getId());
        assertThat(itineraryActivity1).isEqualTo(itineraryActivity2);
        itineraryActivity2.setId(2L);
        assertThat(itineraryActivity1).isNotEqualTo(itineraryActivity2);
        itineraryActivity1.setId(null);
        assertThat(itineraryActivity1).isNotEqualTo(itineraryActivity2);
    }
}
