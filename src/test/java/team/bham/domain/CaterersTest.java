package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class CaterersTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Caterers.class);
        Caterers caterers1 = new Caterers();
        caterers1.setId(1L);
        Caterers caterers2 = new Caterers();
        caterers2.setId(caterers1.getId());
        assertThat(caterers1).isEqualTo(caterers2);
        caterers2.setId(2L);
        assertThat(caterers1).isNotEqualTo(caterers2);
        caterers1.setId(null);
        assertThat(caterers1).isNotEqualTo(caterers2);
    }
}
