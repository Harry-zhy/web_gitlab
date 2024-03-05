package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MockVenueEntityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MockVenueEntity.class);
        MockVenueEntity mockVenueEntity1 = new MockVenueEntity();
        mockVenueEntity1.setId(1L);
        MockVenueEntity mockVenueEntity2 = new MockVenueEntity();
        mockVenueEntity2.setId(mockVenueEntity1.getId());
        assertThat(mockVenueEntity1).isEqualTo(mockVenueEntity2);
        mockVenueEntity2.setId(2L);
        assertThat(mockVenueEntity1).isNotEqualTo(mockVenueEntity2);
        mockVenueEntity1.setId(null);
        assertThat(mockVenueEntity1).isNotEqualTo(mockVenueEntity2);
    }
}
