package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ItineraryGuestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItineraryGuest.class);
        ItineraryGuest itineraryGuest1 = new ItineraryGuest();
        itineraryGuest1.setId(1L);
        ItineraryGuest itineraryGuest2 = new ItineraryGuest();
        itineraryGuest2.setId(itineraryGuest1.getId());
        assertThat(itineraryGuest1).isEqualTo(itineraryGuest2);
        itineraryGuest2.setId(2L);
        assertThat(itineraryGuest1).isNotEqualTo(itineraryGuest2);
        itineraryGuest1.setId(null);
        assertThat(itineraryGuest1).isNotEqualTo(itineraryGuest2);
    }
}
