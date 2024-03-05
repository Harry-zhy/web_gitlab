package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ActivityIdeaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivityIdea.class);
        ActivityIdea activityIdea1 = new ActivityIdea();
        activityIdea1.setId(1L);
        ActivityIdea activityIdea2 = new ActivityIdea();
        activityIdea2.setId(activityIdea1.getId());
        assertThat(activityIdea1).isEqualTo(activityIdea2);
        activityIdea2.setId(2L);
        assertThat(activityIdea1).isNotEqualTo(activityIdea2);
        activityIdea1.setId(null);
        assertThat(activityIdea1).isNotEqualTo(activityIdea2);
    }
}
