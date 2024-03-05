package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class AdsManagementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdsManagement.class);
        AdsManagement adsManagement1 = new AdsManagement();
        adsManagement1.setId(1L);
        AdsManagement adsManagement2 = new AdsManagement();
        adsManagement2.setId(adsManagement1.getId());
        assertThat(adsManagement1).isEqualTo(adsManagement2);
        adsManagement2.setId(2L);
        assertThat(adsManagement1).isNotEqualTo(adsManagement2);
        adsManagement1.setId(null);
        assertThat(adsManagement1).isNotEqualTo(adsManagement2);
    }
}
