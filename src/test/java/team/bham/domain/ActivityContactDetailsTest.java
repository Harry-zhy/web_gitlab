package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ActivityContactDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivityContactDetails.class);
        ActivityContactDetails activityContactDetails1 = new ActivityContactDetails();
        activityContactDetails1.setId(1L);
        ActivityContactDetails activityContactDetails2 = new ActivityContactDetails();
        activityContactDetails2.setId(activityContactDetails1.getId());
        assertThat(activityContactDetails1).isEqualTo(activityContactDetails2);
        activityContactDetails2.setId(2L);
        assertThat(activityContactDetails1).isNotEqualTo(activityContactDetails2);
        activityContactDetails1.setId(null);
        assertThat(activityContactDetails1).isNotEqualTo(activityContactDetails2);
    }
}
