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
import team.bham.domain.AdsManagement;
import team.bham.repository.AdsManagementRepository;

/**
 * Integration tests for the {@link AdsManagementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdsManagementResourceIT {

    private static final Integer DEFAULT_AGE = 1;
    private static final Integer UPDATED_AGE = 2;

    private static final String DEFAULT_GENDER = "AAAAAAAAAA";
    private static final String UPDATED_GENDER = "BBBBBBBBBB";

    private static final String DEFAULT_PREFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_PREFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ads-managements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AdsManagementRepository adsManagementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdsManagementMockMvc;

    private AdsManagement adsManagement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdsManagement createEntity(EntityManager em) {
        AdsManagement adsManagement = new AdsManagement()
            .age(DEFAULT_AGE)
            .gender(DEFAULT_GENDER)
            .preference(DEFAULT_PREFERENCE)
            .location(DEFAULT_LOCATION);
        return adsManagement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdsManagement createUpdatedEntity(EntityManager em) {
        AdsManagement adsManagement = new AdsManagement()
            .age(UPDATED_AGE)
            .gender(UPDATED_GENDER)
            .preference(UPDATED_PREFERENCE)
            .location(UPDATED_LOCATION);
        return adsManagement;
    }

    @BeforeEach
    public void initTest() {
        adsManagement = createEntity(em);
    }

    @Test
    @Transactional
    void createAdsManagement() throws Exception {
        int databaseSizeBeforeCreate = adsManagementRepository.findAll().size();
        // Create the AdsManagement
        restAdsManagementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(adsManagement)))
            .andExpect(status().isCreated());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeCreate + 1);
        AdsManagement testAdsManagement = adsManagementList.get(adsManagementList.size() - 1);
        assertThat(testAdsManagement.getAge()).isEqualTo(DEFAULT_AGE);
        assertThat(testAdsManagement.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testAdsManagement.getPreference()).isEqualTo(DEFAULT_PREFERENCE);
        assertThat(testAdsManagement.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void createAdsManagementWithExistingId() throws Exception {
        // Create the AdsManagement with an existing ID
        adsManagement.setId(1L);

        int databaseSizeBeforeCreate = adsManagementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdsManagementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(adsManagement)))
            .andExpect(status().isBadRequest());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdsManagements() throws Exception {
        // Initialize the database
        adsManagementRepository.saveAndFlush(adsManagement);

        // Get all the adsManagementList
        restAdsManagementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adsManagement.getId().intValue())))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE)))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER)))
            .andExpect(jsonPath("$.[*].preference").value(hasItem(DEFAULT_PREFERENCE)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)));
    }

    @Test
    @Transactional
    void getAdsManagement() throws Exception {
        // Initialize the database
        adsManagementRepository.saveAndFlush(adsManagement);

        // Get the adsManagement
        restAdsManagementMockMvc
            .perform(get(ENTITY_API_URL_ID, adsManagement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(adsManagement.getId().intValue()))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER))
            .andExpect(jsonPath("$.preference").value(DEFAULT_PREFERENCE))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION));
    }

    @Test
    @Transactional
    void getNonExistingAdsManagement() throws Exception {
        // Get the adsManagement
        restAdsManagementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAdsManagement() throws Exception {
        // Initialize the database
        adsManagementRepository.saveAndFlush(adsManagement);

        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();

        // Update the adsManagement
        AdsManagement updatedAdsManagement = adsManagementRepository.findById(adsManagement.getId()).get();
        // Disconnect from session so that the updates on updatedAdsManagement are not directly saved in db
        em.detach(updatedAdsManagement);
        updatedAdsManagement.age(UPDATED_AGE).gender(UPDATED_GENDER).preference(UPDATED_PREFERENCE).location(UPDATED_LOCATION);

        restAdsManagementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAdsManagement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAdsManagement))
            )
            .andExpect(status().isOk());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
        AdsManagement testAdsManagement = adsManagementList.get(adsManagementList.size() - 1);
        assertThat(testAdsManagement.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testAdsManagement.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testAdsManagement.getPreference()).isEqualTo(UPDATED_PREFERENCE);
        assertThat(testAdsManagement.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingAdsManagement() throws Exception {
        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();
        adsManagement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdsManagementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adsManagement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adsManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdsManagement() throws Exception {
        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();
        adsManagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdsManagementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(adsManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdsManagement() throws Exception {
        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();
        adsManagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdsManagementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(adsManagement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdsManagementWithPatch() throws Exception {
        // Initialize the database
        adsManagementRepository.saveAndFlush(adsManagement);

        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();

        // Update the adsManagement using partial update
        AdsManagement partialUpdatedAdsManagement = new AdsManagement();
        partialUpdatedAdsManagement.setId(adsManagement.getId());

        partialUpdatedAdsManagement.age(UPDATED_AGE).preference(UPDATED_PREFERENCE);

        restAdsManagementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdsManagement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdsManagement))
            )
            .andExpect(status().isOk());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
        AdsManagement testAdsManagement = adsManagementList.get(adsManagementList.size() - 1);
        assertThat(testAdsManagement.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testAdsManagement.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testAdsManagement.getPreference()).isEqualTo(UPDATED_PREFERENCE);
        assertThat(testAdsManagement.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdateAdsManagementWithPatch() throws Exception {
        // Initialize the database
        adsManagementRepository.saveAndFlush(adsManagement);

        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();

        // Update the adsManagement using partial update
        AdsManagement partialUpdatedAdsManagement = new AdsManagement();
        partialUpdatedAdsManagement.setId(adsManagement.getId());

        partialUpdatedAdsManagement.age(UPDATED_AGE).gender(UPDATED_GENDER).preference(UPDATED_PREFERENCE).location(UPDATED_LOCATION);

        restAdsManagementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdsManagement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAdsManagement))
            )
            .andExpect(status().isOk());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
        AdsManagement testAdsManagement = adsManagementList.get(adsManagementList.size() - 1);
        assertThat(testAdsManagement.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testAdsManagement.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testAdsManagement.getPreference()).isEqualTo(UPDATED_PREFERENCE);
        assertThat(testAdsManagement.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingAdsManagement() throws Exception {
        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();
        adsManagement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdsManagementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, adsManagement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adsManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdsManagement() throws Exception {
        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();
        adsManagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdsManagementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(adsManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdsManagement() throws Exception {
        int databaseSizeBeforeUpdate = adsManagementRepository.findAll().size();
        adsManagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdsManagementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(adsManagement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdsManagement in the database
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdsManagement() throws Exception {
        // Initialize the database
        adsManagementRepository.saveAndFlush(adsManagement);

        int databaseSizeBeforeDelete = adsManagementRepository.findAll().size();

        // Delete the adsManagement
        restAdsManagementMockMvc
            .perform(delete(ENTITY_API_URL_ID, adsManagement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AdsManagement> adsManagementList = adsManagementRepository.findAll();
        assertThat(adsManagementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
