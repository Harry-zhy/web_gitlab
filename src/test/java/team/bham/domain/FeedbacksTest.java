package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class FeedbacksTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Feedbacks.class);
        Feedbacks feedbacks1 = new Feedbacks();
        feedbacks1.setId(1L);
        Feedbacks feedbacks2 = new Feedbacks();
        feedbacks2.setId(feedbacks1.getId());
        assertThat(feedbacks1).isEqualTo(feedbacks2);
        feedbacks2.setId(2L);
        assertThat(feedbacks1).isNotEqualTo(feedbacks2);
        feedbacks1.setId(null);
        assertThat(feedbacks1).isNotEqualTo(feedbacks2);
    }
}
