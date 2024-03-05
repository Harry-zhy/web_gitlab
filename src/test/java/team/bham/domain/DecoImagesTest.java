package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DecoImagesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DecoImages.class);
        DecoImages decoImages1 = new DecoImages();
        decoImages1.setId(1L);
        DecoImages decoImages2 = new DecoImages();
        decoImages2.setId(decoImages1.getId());
        assertThat(decoImages1).isEqualTo(decoImages2);
        decoImages2.setId(2L);
        assertThat(decoImages1).isNotEqualTo(decoImages2);
        decoImages1.setId(null);
        assertThat(decoImages1).isNotEqualTo(decoImages2);
    }
}
