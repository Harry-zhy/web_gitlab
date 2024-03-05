package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class IntroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Intro.class);
        Intro intro1 = new Intro();
        intro1.setId(1L);
        Intro intro2 = new Intro();
        intro2.setId(intro1.getId());
        assertThat(intro1).isEqualTo(intro2);
        intro2.setId(2L);
        assertThat(intro1).isNotEqualTo(intro2);
        intro1.setId(null);
        assertThat(intro1).isNotEqualTo(intro2);
    }
}
