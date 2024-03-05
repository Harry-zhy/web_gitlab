package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class OneFeedbackTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OneFeedback.class);
        OneFeedback oneFeedback1 = new OneFeedback();
        oneFeedback1.setId(1L);
        OneFeedback oneFeedback2 = new OneFeedback();
        oneFeedback2.setId(oneFeedback1.getId());
        assertThat(oneFeedback1).isEqualTo(oneFeedback2);
        oneFeedback2.setId(2L);
        assertThat(oneFeedback1).isNotEqualTo(oneFeedback2);
        oneFeedback1.setId(null);
        assertThat(oneFeedback1).isNotEqualTo(oneFeedback2);
    }
}
