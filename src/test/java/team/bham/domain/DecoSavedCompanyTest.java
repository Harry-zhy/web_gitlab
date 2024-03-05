package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DecoSavedCompanyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DecoSavedCompany.class);
        DecoSavedCompany decoSavedCompany1 = new DecoSavedCompany();
        decoSavedCompany1.setId(1L);
        DecoSavedCompany decoSavedCompany2 = new DecoSavedCompany();
        decoSavedCompany2.setId(decoSavedCompany1.getId());
        assertThat(decoSavedCompany1).isEqualTo(decoSavedCompany2);
        decoSavedCompany2.setId(2L);
        assertThat(decoSavedCompany1).isNotEqualTo(decoSavedCompany2);
        decoSavedCompany1.setId(null);
        assertThat(decoSavedCompany1).isNotEqualTo(decoSavedCompany2);
    }
}
