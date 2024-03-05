package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ActivityCompanyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivityCompany.class);
        ActivityCompany activityCompany1 = new ActivityCompany();
        activityCompany1.setId(1L);
        ActivityCompany activityCompany2 = new ActivityCompany();
        activityCompany2.setId(activityCompany1.getId());
        assertThat(activityCompany1).isEqualTo(activityCompany2);
        activityCompany2.setId(2L);
        assertThat(activityCompany1).isNotEqualTo(activityCompany2);
        activityCompany1.setId(null);
        assertThat(activityCompany1).isNotEqualTo(activityCompany2);
    }
}
