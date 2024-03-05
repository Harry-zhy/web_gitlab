package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class EventItineraryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventItinerary.class);
        EventItinerary eventItinerary1 = new EventItinerary();
        eventItinerary1.setId(1L);
        EventItinerary eventItinerary2 = new EventItinerary();
        eventItinerary2.setId(eventItinerary1.getId());
        assertThat(eventItinerary1).isEqualTo(eventItinerary2);
        eventItinerary2.setId(2L);
        assertThat(eventItinerary1).isNotEqualTo(eventItinerary2);
        eventItinerary1.setId(null);
        assertThat(eventItinerary1).isNotEqualTo(eventItinerary2);
    }
}
