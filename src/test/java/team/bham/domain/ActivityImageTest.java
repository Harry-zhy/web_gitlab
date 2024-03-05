package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class ActivityImageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivityImage.class);
        ActivityImage activityImage1 = new ActivityImage();
        activityImage1.setId(1L);
        ActivityImage activityImage2 = new ActivityImage();
        activityImage2.setId(activityImage1.getId());
        assertThat(activityImage1).isEqualTo(activityImage2);
        activityImage2.setId(2L);
        assertThat(activityImage1).isNotEqualTo(activityImage2);
        activityImage1.setId(null);
        assertThat(activityImage1).isNotEqualTo(activityImage2);
    }
}
