package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DecoContactDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DecoContactDetails.class);
        DecoContactDetails decoContactDetails1 = new DecoContactDetails();
        decoContactDetails1.setId(1L);
        DecoContactDetails decoContactDetails2 = new DecoContactDetails();
        decoContactDetails2.setId(decoContactDetails1.getId());
        assertThat(decoContactDetails1).isEqualTo(decoContactDetails2);
        decoContactDetails2.setId(2L);
        assertThat(decoContactDetails1).isNotEqualTo(decoContactDetails2);
        decoContactDetails1.setId(null);
        assertThat(decoContactDetails1).isNotEqualTo(decoContactDetails2);
    }
}
