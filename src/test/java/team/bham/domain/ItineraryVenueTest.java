package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ItineraryVenueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItineraryVenue.class);
        ItineraryVenue itineraryVenue1 = new ItineraryVenue();
        itineraryVenue1.setId(1L);
        ItineraryVenue itineraryVenue2 = new ItineraryVenue();
        itineraryVenue2.setId(itineraryVenue1.getId());
        assertThat(itineraryVenue1).isEqualTo(itineraryVenue2);
        itineraryVenue2.setId(2L);
        assertThat(itineraryVenue1).isNotEqualTo(itineraryVenue2);
        itineraryVenue1.setId(null);
        assertThat(itineraryVenue1).isNotEqualTo(itineraryVenue2);
    }
}
