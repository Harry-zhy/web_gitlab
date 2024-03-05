package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ItineraryDateTimeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItineraryDateTime.class);
        ItineraryDateTime itineraryDateTime1 = new ItineraryDateTime();
        itineraryDateTime1.setId(1L);
        ItineraryDateTime itineraryDateTime2 = new ItineraryDateTime();
        itineraryDateTime2.setId(itineraryDateTime1.getId());
        assertThat(itineraryDateTime1).isEqualTo(itineraryDateTime2);
        itineraryDateTime2.setId(2L);
        assertThat(itineraryDateTime1).isNotEqualTo(itineraryDateTime2);
        itineraryDateTime1.setId(null);
        assertThat(itineraryDateTime1).isNotEqualTo(itineraryDateTime2);
    }
}
