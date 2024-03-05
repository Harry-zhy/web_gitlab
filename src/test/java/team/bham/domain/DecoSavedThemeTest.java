package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DecoSavedThemeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DecoSavedTheme.class);
        DecoSavedTheme decoSavedTheme1 = new DecoSavedTheme();
        decoSavedTheme1.setId(1L);
        DecoSavedTheme decoSavedTheme2 = new DecoSavedTheme();
        decoSavedTheme2.setId(decoSavedTheme1.getId());
        assertThat(decoSavedTheme1).isEqualTo(decoSavedTheme2);
        decoSavedTheme2.setId(2L);
        assertThat(decoSavedTheme1).isNotEqualTo(decoSavedTheme2);
        decoSavedTheme1.setId(null);
        assertThat(decoSavedTheme1).isNotEqualTo(decoSavedTheme2);
    }
}
