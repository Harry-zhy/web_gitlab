package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DecoCompanyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DecoCompany.class);
        DecoCompany decoCompany1 = new DecoCompany();
        decoCompany1.setId(1L);
        DecoCompany decoCompany2 = new DecoCompany();
        decoCompany2.setId(decoCompany1.getId());
        assertThat(decoCompany1).isEqualTo(decoCompany2);
        decoCompany2.setId(2L);
        assertThat(decoCompany1).isNotEqualTo(decoCompany2);
        decoCompany1.setId(null);
        assertThat(decoCompany1).isNotEqualTo(decoCompany2);
    }
}
