package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DecoThemesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DecoThemes.class);
        DecoThemes decoThemes1 = new DecoThemes();
        decoThemes1.setId(1L);
        DecoThemes decoThemes2 = new DecoThemes();
        decoThemes2.setId(decoThemes1.getId());
        assertThat(decoThemes1).isEqualTo(decoThemes2);
        decoThemes2.setId(2L);
        assertThat(decoThemes1).isNotEqualTo(decoThemes2);
        decoThemes1.setId(null);
        assertThat(decoThemes1).isNotEqualTo(decoThemes2);
    }
}
