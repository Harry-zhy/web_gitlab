package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class VenueInformationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VenueInformation.class);
        VenueInformation venueInformation1 = new VenueInformation();
        venueInformation1.setId(1L);
        VenueInformation venueInformation2 = new VenueInformation();
        venueInformation2.setId(venueInformation1.getId());
        assertThat(venueInformation1).isEqualTo(venueInformation2);
        venueInformation2.setId(2L);
        assertThat(venueInformation1).isNotEqualTo(venueInformation2);
        venueInformation1.setId(null);
        assertThat(venueInformation1).isNotEqualTo(venueInformation2);
    }
}
