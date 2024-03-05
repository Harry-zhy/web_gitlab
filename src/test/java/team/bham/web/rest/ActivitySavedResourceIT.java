package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static team.bham.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
import team.bham.domain.ActivitySaved;
import team.bham.repository.ActivitySavedRepository;

/**
 * Integration tests for the {@link ActivitySavedResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActivitySavedResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMPANY = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/activity-saveds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActivitySavedRepository activitySavedRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivitySavedMockMvc;

    private ActivitySaved activitySaved;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivitySaved createEntity(EntityManager em) {
        ActivitySaved activitySaved = new ActivitySaved().name(DEFAULT_NAME).date(DEFAULT_DATE).company(DEFAULT_COMPANY);
        return activitySaved;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivitySaved createUpdatedEntity(EntityManager em) {
        ActivitySaved activitySaved = new ActivitySaved().name(UPDATED_NAME).date(UPDATED_DATE).company(UPDATED_COMPANY);
        return activitySaved;
    }

    @BeforeEach
    public void initTest() {
        activitySaved = createEntity(em);
    }

    @Test
    @Transactional
    void createActivitySaved() throws Exception {
        int databaseSizeBeforeCreate = activitySavedRepository.findAll().size();
        // Create the ActivitySaved
        restActivitySavedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySaved)))
            .andExpect(status().isCreated());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeCreate + 1);
        ActivitySaved testActivitySaved = activitySavedList.get(activitySavedList.size() - 1);
        assertThat(testActivitySaved.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testActivitySaved.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testActivitySaved.getCompany()).isEqualTo(DEFAULT_COMPANY);
    }

    @Test
    @Transactional
    void createActivitySavedWithExistingId() throws Exception {
        // Create the ActivitySaved with an existing ID
        activitySaved.setId(1L);

        int databaseSizeBeforeCreate = activitySavedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivitySavedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySaved)))
            .andExpect(status().isBadRequest());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = activitySavedRepository.findAll().size();
        // set the field null
        activitySaved.setName(null);

        // Create the ActivitySaved, which fails.

        restActivitySavedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySaved)))
            .andExpect(status().isBadRequest());

        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = activitySavedRepository.findAll().size();
        // set the field null
        activitySaved.setDate(null);

        // Create the ActivitySaved, which fails.

        restActivitySavedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySaved)))
            .andExpect(status().isBadRequest());

        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllActivitySaveds() throws Exception {
        // Initialize the database
        activitySavedRepository.saveAndFlush(activitySaved);

        // Get all the activitySavedList
        restActivitySavedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activitySaved.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)));
    }

    @Test
    @Transactional
    void getActivitySaved() throws Exception {
        // Initialize the database
        activitySavedRepository.saveAndFlush(activitySaved);

        // Get the activitySaved
        restActivitySavedMockMvc
            .perform(get(ENTITY_API_URL_ID, activitySaved.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activitySaved.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY));
    }

    @Test
    @Transactional
    void getNonExistingActivitySaved() throws Exception {
        // Get the activitySaved
        restActivitySavedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActivitySaved() throws Exception {
        // Initialize the database
        activitySavedRepository.saveAndFlush(activitySaved);

        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();

        // Update the activitySaved
        ActivitySaved updatedActivitySaved = activitySavedRepository.findById(activitySaved.getId()).get();
        // Disconnect from session so that the updates on updatedActivitySaved are not directly saved in db
        em.detach(updatedActivitySaved);
        updatedActivitySaved.name(UPDATED_NAME).date(UPDATED_DATE).company(UPDATED_COMPANY);

        restActivitySavedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivitySaved.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivitySaved))
            )
            .andExpect(status().isOk());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
        ActivitySaved testActivitySaved = activitySavedList.get(activitySavedList.size() - 1);
        assertThat(testActivitySaved.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivitySaved.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testActivitySaved.getCompany()).isEqualTo(UPDATED_COMPANY);
    }

    @Test
    @Transactional
    void putNonExistingActivitySaved() throws Exception {
        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();
        activitySaved.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivitySavedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activitySaved.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activitySaved))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivitySaved() throws Exception {
        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();
        activitySaved.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitySavedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activitySaved))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivitySaved() throws Exception {
        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();
        activitySaved.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitySavedMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySaved)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActivitySavedWithPatch() throws Exception {
        // Initialize the database
        activitySavedRepository.saveAndFlush(activitySaved);

        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();

        // Update the activitySaved using partial update
        ActivitySaved partialUpdatedActivitySaved = new ActivitySaved();
        partialUpdatedActivitySaved.setId(activitySaved.getId());

        partialUpdatedActivitySaved.name(UPDATED_NAME);

        restActivitySavedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivitySaved.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivitySaved))
            )
            .andExpect(status().isOk());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
        ActivitySaved testActivitySaved = activitySavedList.get(activitySavedList.size() - 1);
        assertThat(testActivitySaved.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivitySaved.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testActivitySaved.getCompany()).isEqualTo(DEFAULT_COMPANY);
    }

    @Test
    @Transactional
    void fullUpdateActivitySavedWithPatch() throws Exception {
        // Initialize the database
        activitySavedRepository.saveAndFlush(activitySaved);

        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();

        // Update the activitySaved using partial update
        ActivitySaved partialUpdatedActivitySaved = new ActivitySaved();
        partialUpdatedActivitySaved.setId(activitySaved.getId());

        partialUpdatedActivitySaved.name(UPDATED_NAME).date(UPDATED_DATE).company(UPDATED_COMPANY);

        restActivitySavedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivitySaved.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivitySaved))
            )
            .andExpect(status().isOk());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
        ActivitySaved testActivitySaved = activitySavedList.get(activitySavedList.size() - 1);
        assertThat(testActivitySaved.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivitySaved.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testActivitySaved.getCompany()).isEqualTo(UPDATED_COMPANY);
    }

    @Test
    @Transactional
    void patchNonExistingActivitySaved() throws Exception {
        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();
        activitySaved.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivitySavedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activitySaved.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activitySaved))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivitySaved() throws Exception {
        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();
        activitySaved.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitySavedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activitySaved))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivitySaved() throws Exception {
        int databaseSizeBeforeUpdate = activitySavedRepository.findAll().size();
        activitySaved.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitySavedMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(activitySaved))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivitySaved in the database
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivitySaved() throws Exception {
        // Initialize the database
        activitySavedRepository.saveAndFlush(activitySaved);

        int databaseSizeBeforeDelete = activitySavedRepository.findAll().size();

        // Delete the activitySaved
        restActivitySavedMockMvc
            .perform(delete(ENTITY_API_URL_ID, activitySaved.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActivitySaved> activitySavedList = activitySavedRepository.findAll();
        assertThat(activitySavedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
