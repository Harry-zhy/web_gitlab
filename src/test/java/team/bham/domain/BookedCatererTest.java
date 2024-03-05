package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class BookedCatererTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BookedCaterer.class);
        BookedCaterer bookedCaterer1 = new BookedCaterer();
        bookedCaterer1.setId(1L);
        BookedCaterer bookedCaterer2 = new BookedCaterer();
        bookedCaterer2.setId(bookedCaterer1.getId());
        assertThat(bookedCaterer1).isEqualTo(bookedCaterer2);
        bookedCaterer2.setId(2L);
        assertThat(bookedCaterer1).isNotEqualTo(bookedCaterer2);
        bookedCaterer1.setId(null);
        assertThat(bookedCaterer1).isNotEqualTo(bookedCaterer2);
    }
}
