package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class MCQOptionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MCQOption.class);
        MCQOption mCQOption1 = new MCQOption();
        mCQOption1.setId(1L);
        MCQOption mCQOption2 = new MCQOption();
        mCQOption2.setId(mCQOption1.getId());
        assertThat(mCQOption1).isEqualTo(mCQOption2);
        mCQOption2.setId(2L);
        assertThat(mCQOption1).isNotEqualTo(mCQOption2);
        mCQOption1.setId(null);
        assertThat(mCQOption1).isNotEqualTo(mCQOption2);
    }
}
