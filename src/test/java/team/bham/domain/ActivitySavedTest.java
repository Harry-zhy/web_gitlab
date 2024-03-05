package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ActivitySavedTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivitySaved.class);
        ActivitySaved activitySaved1 = new ActivitySaved();
        activitySaved1.setId(1L);
        ActivitySaved activitySaved2 = new ActivitySaved();
        activitySaved2.setId(activitySaved1.getId());
        assertThat(activitySaved1).isEqualTo(activitySaved2);
        activitySaved2.setId(2L);
        assertThat(activitySaved1).isNotEqualTo(activitySaved2);
        activitySaved1.setId(null);
        assertThat(activitySaved1).isNotEqualTo(activitySaved2);
    }
}
