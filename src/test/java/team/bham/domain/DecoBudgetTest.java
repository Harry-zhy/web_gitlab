package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DecoBudgetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DecoBudget.class);
        DecoBudget decoBudget1 = new DecoBudget();
        decoBudget1.setId(1L);
        DecoBudget decoBudget2 = new DecoBudget();
        decoBudget2.setId(decoBudget1.getId());
        assertThat(decoBudget1).isEqualTo(decoBudget2);
        decoBudget2.setId(2L);
        assertThat(decoBudget1).isNotEqualTo(decoBudget2);
        decoBudget1.setId(null);
        assertThat(decoBudget1).isNotEqualTo(decoBudget2);
    }
}
