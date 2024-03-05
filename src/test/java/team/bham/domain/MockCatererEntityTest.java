package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MockCatererEntityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MockCatererEntity.class);
        MockCatererEntity mockCatererEntity1 = new MockCatererEntity();
        mockCatererEntity1.setId(1L);
        MockCatererEntity mockCatererEntity2 = new MockCatererEntity();
        mockCatererEntity2.setId(mockCatererEntity1.getId());
        assertThat(mockCatererEntity1).isEqualTo(mockCatererEntity2);
        mockCatererEntity2.setId(2L);
        assertThat(mockCatererEntity1).isNotEqualTo(mockCatererEntity2);
        mockCatererEntity1.setId(null);
        assertThat(mockCatererEntity1).isNotEqualTo(mockCatererEntity2);
    }
}
