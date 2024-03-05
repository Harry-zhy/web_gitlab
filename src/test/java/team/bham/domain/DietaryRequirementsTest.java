package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class DietaryRequirementsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DietaryRequirements.class);
        DietaryRequirements dietaryRequirements1 = new DietaryRequirements();
        dietaryRequirements1.setId(1L);
        DietaryRequirements dietaryRequirements2 = new DietaryRequirements();
        dietaryRequirements2.setId(dietaryRequirements1.getId());
        assertThat(dietaryRequirements1).isEqualTo(dietaryRequirements2);
        dietaryRequirements2.setId(2L);
        assertThat(dietaryRequirements1).isNotEqualTo(dietaryRequirements2);
        dietaryRequirements1.setId(null);
        assertThat(dietaryRequirements1).isNotEqualTo(dietaryRequirements2);
    }
}
