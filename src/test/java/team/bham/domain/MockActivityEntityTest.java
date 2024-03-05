package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MockActivityEntityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MockActivityEntity.class);
        MockActivityEntity mockActivityEntity1 = new MockActivityEntity();
        mockActivityEntity1.setId(1L);
        MockActivityEntity mockActivityEntity2 = new MockActivityEntity();
        mockActivityEntity2.setId(mockActivityEntity1.getId());
        assertThat(mockActivityEntity1).isEqualTo(mockActivityEntity2);
        mockActivityEntity2.setId(2L);
        assertThat(mockActivityEntity1).isNotEqualTo(mockActivityEntity2);
        mockActivityEntity1.setId(null);
        assertThat(mockActivityEntity1).isNotEqualTo(mockActivityEntity2);
    }
}
