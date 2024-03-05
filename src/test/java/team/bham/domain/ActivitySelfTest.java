package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ActivitySelfTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivitySelf.class);
        ActivitySelf activitySelf1 = new ActivitySelf();
        activitySelf1.setId(1L);
        ActivitySelf activitySelf2 = new ActivitySelf();
        activitySelf2.setId(activitySelf1.getId());
        assertThat(activitySelf1).isEqualTo(activitySelf2);
        activitySelf2.setId(2L);
        assertThat(activitySelf1).isNotEqualTo(activitySelf2);
        activitySelf1.setId(null);
        assertThat(activitySelf1).isNotEqualTo(activitySelf2);
    }
}
