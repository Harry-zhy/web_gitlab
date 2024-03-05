package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class BookedActivityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BookedActivity.class);
        BookedActivity bookedActivity1 = new BookedActivity();
        bookedActivity1.setId(1L);
        BookedActivity bookedActivity2 = new BookedActivity();
        bookedActivity2.setId(bookedActivity1.getId());
        assertThat(bookedActivity1).isEqualTo(bookedActivity2);
        bookedActivity2.setId(2L);
        assertThat(bookedActivity1).isNotEqualTo(bookedActivity2);
        bookedActivity1.setId(null);
        assertThat(bookedActivity1).isNotEqualTo(bookedActivity2);
    }
}
