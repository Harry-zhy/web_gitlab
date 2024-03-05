package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.DietaryRequirements;
import team.bham.repository.DietaryRequirementsRepository;

/**
 * Integration tests for the {@link DietaryRequirementsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DietaryRequirementsResourceIT {

    private static final String DEFAULT_OPTION = "AAAAAAAAAA";
    private static final String UPDATED_OPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/dietary-requirements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DietaryRequirementsRepository dietaryRequirementsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDietaryRequirementsMockMvc;

    private DietaryRequirements dietaryRequirements;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DietaryRequirements createEntity(EntityManager em) {
        DietaryRequirements dietaryRequirements = new DietaryRequirements().option(DEFAULT_OPTION);
        return dietaryRequirements;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DietaryRequirements createUpdatedEntity(EntityManager em) {
        DietaryRequirements dietaryRequirements = new DietaryRequirements().option(UPDATED_OPTION);
        return dietaryRequirements;
    }

    @BeforeEach
    public void initTest() {
        dietaryRequirements = createEntity(em);
    }

    @Test
    @Transactional
    void createDietaryRequirements() throws Exception {
        int databaseSizeBeforeCreate = dietaryRequirementsRepository.findAll().size();
        // Create the DietaryRequirements
        restDietaryRequirementsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dietaryRequirements))
            )
            .andExpect(status().isCreated());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeCreate + 1);
        DietaryRequirements testDietaryRequirements = dietaryRequirementsList.get(dietaryRequirementsList.size() - 1);
        assertThat(testDietaryRequirements.getOption()).isEqualTo(DEFAULT_OPTION);
    }

    @Test
    @Transactional
    void createDietaryRequirementsWithExistingId() throws Exception {
        // Create the DietaryRequirements with an existing ID
        dietaryRequirements.setId(1L);

        int databaseSizeBeforeCreate = dietaryRequirementsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDietaryRequirementsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dietaryRequirements))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDietaryRequirements() throws Exception {
        // Initialize the database
        dietaryRequirementsRepository.saveAndFlush(dietaryRequirements);

        // Get all the dietaryRequirementsList
        restDietaryRequirementsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dietaryRequirements.getId().intValue())))
            .andExpect(jsonPath("$.[*].option").value(hasItem(DEFAULT_OPTION)));
    }

    @Test
    @Transactional
    void getDietaryRequirements() throws Exception {
        // Initialize the database
        dietaryRequirementsRepository.saveAndFlush(dietaryRequirements);

        // Get the dietaryRequirements
        restDietaryRequirementsMockMvc
            .perform(get(ENTITY_API_URL_ID, dietaryRequirements.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dietaryRequirements.getId().intValue()))
            .andExpect(jsonPath("$.option").value(DEFAULT_OPTION));
    }

    @Test
    @Transactional
    void getNonExistingDietaryRequirements() throws Exception {
        // Get the dietaryRequirements
        restDietaryRequirementsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDietaryRequirements() throws Exception {
        // Initialize the database
        dietaryRequirementsRepository.saveAndFlush(dietaryRequirements);

        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();

        // Update the dietaryRequirements
        DietaryRequirements updatedDietaryRequirements = dietaryRequirementsRepository.findById(dietaryRequirements.getId()).get();
        // Disconnect from session so that the updates on updatedDietaryRequirements are not directly saved in db
        em.detach(updatedDietaryRequirements);
        updatedDietaryRequirements.option(UPDATED_OPTION);

        restDietaryRequirementsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDietaryRequirements.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDietaryRequirements))
            )
            .andExpect(status().isOk());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
        DietaryRequirements testDietaryRequirements = dietaryRequirementsList.get(dietaryRequirementsList.size() - 1);
        assertThat(testDietaryRequirements.getOption()).isEqualTo(UPDATED_OPTION);
    }

    @Test
    @Transactional
    void putNonExistingDietaryRequirements() throws Exception {
        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();
        dietaryRequirements.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDietaryRequirementsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dietaryRequirements.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dietaryRequirements))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDietaryRequirements() throws Exception {
        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();
        dietaryRequirements.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDietaryRequirementsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dietaryRequirements))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDietaryRequirements() throws Exception {
        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();
        dietaryRequirements.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDietaryRequirementsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dietaryRequirements))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDietaryRequirementsWithPatch() throws Exception {
        // Initialize the database
        dietaryRequirementsRepository.saveAndFlush(dietaryRequirements);

        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();

        // Update the dietaryRequirements using partial update
        DietaryRequirements partialUpdatedDietaryRequirements = new DietaryRequirements();
        partialUpdatedDietaryRequirements.setId(dietaryRequirements.getId());

        partialUpdatedDietaryRequirements.option(UPDATED_OPTION);

        restDietaryRequirementsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDietaryRequirements.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDietaryRequirements))
            )
            .andExpect(status().isOk());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
        DietaryRequirements testDietaryRequirements = dietaryRequirementsList.get(dietaryRequirementsList.size() - 1);
        assertThat(testDietaryRequirements.getOption()).isEqualTo(UPDATED_OPTION);
    }

    @Test
    @Transactional
    void fullUpdateDietaryRequirementsWithPatch() throws Exception {
        // Initialize the database
        dietaryRequirementsRepository.saveAndFlush(dietaryRequirements);

        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();

        // Update the dietaryRequirements using partial update
        DietaryRequirements partialUpdatedDietaryRequirements = new DietaryRequirements();
        partialUpdatedDietaryRequirements.setId(dietaryRequirements.getId());

        partialUpdatedDietaryRequirements.option(UPDATED_OPTION);

        restDietaryRequirementsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDietaryRequirements.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDietaryRequirements))
            )
            .andExpect(status().isOk());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
        DietaryRequirements testDietaryRequirements = dietaryRequirementsList.get(dietaryRequirementsList.size() - 1);
        assertThat(testDietaryRequirements.getOption()).isEqualTo(UPDATED_OPTION);
    }

    @Test
    @Transactional
    void patchNonExistingDietaryRequirements() throws Exception {
        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();
        dietaryRequirements.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDietaryRequirementsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dietaryRequirements.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dietaryRequirements))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDietaryRequirements() throws Exception {
        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();
        dietaryRequirements.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDietaryRequirementsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dietaryRequirements))
            )
            .andExpect(status().isBadRequest());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDietaryRequirements() throws Exception {
        int databaseSizeBeforeUpdate = dietaryRequirementsRepository.findAll().size();
        dietaryRequirements.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDietaryRequirementsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dietaryRequirements))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DietaryRequirements in the database
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDietaryRequirements() throws Exception {
        // Initialize the database
        dietaryRequirementsRepository.saveAndFlush(dietaryRequirements);

        int databaseSizeBeforeDelete = dietaryRequirementsRepository.findAll().size();

        // Delete the dietaryRequirements
        restDietaryRequirementsMockMvc
            .perform(delete(ENTITY_API_URL_ID, dietaryRequirements.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DietaryRequirements> dietaryRequirementsList = dietaryRequirementsRepository.findAll();
        assertThat(dietaryRequirementsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
