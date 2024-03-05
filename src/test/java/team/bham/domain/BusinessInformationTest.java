package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class BusinessInformationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusinessInformation.class);
        BusinessInformation businessInformation1 = new BusinessInformation();
        businessInformation1.setId(1L);
        BusinessInformation businessInformation2 = new BusinessInformation();
        businessInformation2.setId(businessInformation1.getId());
        assertThat(businessInformation1).isEqualTo(businessInformation2);
        businessInformation2.setId(2L);
        assertThat(businessInformation1).isNotEqualTo(businessInformation2);
        businessInformation1.setId(null);
        assertThat(businessInformation1).isNotEqualTo(businessInformation2);
    }
}
