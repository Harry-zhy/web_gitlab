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
import team.bham.domain.ItineraryActivity;
import team.bham.repository.ItineraryActivityRepository;

/**
 * Integration tests for the {@link ItineraryActivityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItineraryActivityResourceIT {

    private static final String DEFAULT_ACTIVITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ACTIVITY_NAME = "BBBBBBBBBB";

    private static final Float DEFAULT_ACTIVITY_COST = 1F;
    private static final Float UPDATED_ACTIVITY_COST = 2F;

    private static final String DEFAULT_ACTIVITY_HOST = "AAAAAAAAAA";
    private static final String UPDATED_ACTIVITY_HOST = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_ACTIVITY_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ACTIVITY_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/itinerary-activities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItineraryActivityRepository itineraryActivityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItineraryActivityMockMvc;

    private ItineraryActivity itineraryActivity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryActivity createEntity(EntityManager em) {
        ItineraryActivity itineraryActivity = new ItineraryActivity()
            .activityName(DEFAULT_ACTIVITY_NAME)
            .activityCost(DEFAULT_ACTIVITY_COST)
            .activityHost(DEFAULT_ACTIVITY_HOST)
            .activityTime(DEFAULT_ACTIVITY_TIME);
        return itineraryActivity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryActivity createUpdatedEntity(EntityManager em) {
        ItineraryActivity itineraryActivity = new ItineraryActivity()
            .activityName(UPDATED_ACTIVITY_NAME)
            .activityCost(UPDATED_ACTIVITY_COST)
            .activityHost(UPDATED_ACTIVITY_HOST)
            .activityTime(UPDATED_ACTIVITY_TIME);
        return itineraryActivity;
    }

    @BeforeEach
    public void initTest() {
        itineraryActivity = createEntity(em);
    }

    @Test
    @Transactional
    void createItineraryActivity() throws Exception {
        int databaseSizeBeforeCreate = itineraryActivityRepository.findAll().size();
        // Create the ItineraryActivity
        restItineraryActivityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryActivity))
            )
            .andExpect(status().isCreated());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeCreate + 1);
        ItineraryActivity testItineraryActivity = itineraryActivityList.get(itineraryActivityList.size() - 1);
        assertThat(testItineraryActivity.getActivityName()).isEqualTo(DEFAULT_ACTIVITY_NAME);
        assertThat(testItineraryActivity.getActivityCost()).isEqualTo(DEFAULT_ACTIVITY_COST);
        assertThat(testItineraryActivity.getActivityHost()).isEqualTo(DEFAULT_ACTIVITY_HOST);
        assertThat(testItineraryActivity.getActivityTime()).isEqualTo(DEFAULT_ACTIVITY_TIME);
    }

    @Test
    @Transactional
    void createItineraryActivityWithExistingId() throws Exception {
        // Create the ItineraryActivity with an existing ID
        itineraryActivity.setId(1L);

        int databaseSizeBeforeCreate = itineraryActivityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItineraryActivityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItineraryActivities() throws Exception {
        // Initialize the database
        itineraryActivityRepository.saveAndFlush(itineraryActivity);

        // Get all the itineraryActivityList
        restItineraryActivityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itineraryActivity.getId().intValue())))
            .andExpect(jsonPath("$.[*].activityName").value(hasItem(DEFAULT_ACTIVITY_NAME)))
            .andExpect(jsonPath("$.[*].activityCost").value(hasItem(DEFAULT_ACTIVITY_COST.doubleValue())))
            .andExpect(jsonPath("$.[*].activityHost").value(hasItem(DEFAULT_ACTIVITY_HOST)))
            .andExpect(jsonPath("$.[*].activityTime").value(hasItem(sameInstant(DEFAULT_ACTIVITY_TIME))));
    }

    @Test
    @Transactional
    void getItineraryActivity() throws Exception {
        // Initialize the database
        itineraryActivityRepository.saveAndFlush(itineraryActivity);

        // Get the itineraryActivity
        restItineraryActivityMockMvc
            .perform(get(ENTITY_API_URL_ID, itineraryActivity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itineraryActivity.getId().intValue()))
            .andExpect(jsonPath("$.activityName").value(DEFAULT_ACTIVITY_NAME))
            .andExpect(jsonPath("$.activityCost").value(DEFAULT_ACTIVITY_COST.doubleValue()))
            .andExpect(jsonPath("$.activityHost").value(DEFAULT_ACTIVITY_HOST))
            .andExpect(jsonPath("$.activityTime").value(sameInstant(DEFAULT_ACTIVITY_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingItineraryActivity() throws Exception {
        // Get the itineraryActivity
        restItineraryActivityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItineraryActivity() throws Exception {
        // Initialize the database
        itineraryActivityRepository.saveAndFlush(itineraryActivity);

        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();

        // Update the itineraryActivity
        ItineraryActivity updatedItineraryActivity = itineraryActivityRepository.findById(itineraryActivity.getId()).get();
        // Disconnect from session so that the updates on updatedItineraryActivity are not directly saved in db
        em.detach(updatedItineraryActivity);
        updatedItineraryActivity
            .activityName(UPDATED_ACTIVITY_NAME)
            .activityCost(UPDATED_ACTIVITY_COST)
            .activityHost(UPDATED_ACTIVITY_HOST)
            .activityTime(UPDATED_ACTIVITY_TIME);

        restItineraryActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItineraryActivity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItineraryActivity))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
        ItineraryActivity testItineraryActivity = itineraryActivityList.get(itineraryActivityList.size() - 1);
        assertThat(testItineraryActivity.getActivityName()).isEqualTo(UPDATED_ACTIVITY_NAME);
        assertThat(testItineraryActivity.getActivityCost()).isEqualTo(UPDATED_ACTIVITY_COST);
        assertThat(testItineraryActivity.getActivityHost()).isEqualTo(UPDATED_ACTIVITY_HOST);
        assertThat(testItineraryActivity.getActivityTime()).isEqualTo(UPDATED_ACTIVITY_TIME);
    }

    @Test
    @Transactional
    void putNonExistingItineraryActivity() throws Exception {
        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();
        itineraryActivity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itineraryActivity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItineraryActivity() throws Exception {
        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();
        itineraryActivity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItineraryActivity() throws Exception {
        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();
        itineraryActivity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryActivityMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryActivity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItineraryActivityWithPatch() throws Exception {
        // Initialize the database
        itineraryActivityRepository.saveAndFlush(itineraryActivity);

        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();

        // Update the itineraryActivity using partial update
        ItineraryActivity partialUpdatedItineraryActivity = new ItineraryActivity();
        partialUpdatedItineraryActivity.setId(itineraryActivity.getId());

        partialUpdatedItineraryActivity.activityCost(UPDATED_ACTIVITY_COST).activityHost(UPDATED_ACTIVITY_HOST);

        restItineraryActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryActivity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryActivity))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
        ItineraryActivity testItineraryActivity = itineraryActivityList.get(itineraryActivityList.size() - 1);
        assertThat(testItineraryActivity.getActivityName()).isEqualTo(DEFAULT_ACTIVITY_NAME);
        assertThat(testItineraryActivity.getActivityCost()).isEqualTo(UPDATED_ACTIVITY_COST);
        assertThat(testItineraryActivity.getActivityHost()).isEqualTo(UPDATED_ACTIVITY_HOST);
        assertThat(testItineraryActivity.getActivityTime()).isEqualTo(DEFAULT_ACTIVITY_TIME);
    }

    @Test
    @Transactional
    void fullUpdateItineraryActivityWithPatch() throws Exception {
        // Initialize the database
        itineraryActivityRepository.saveAndFlush(itineraryActivity);

        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();

        // Update the itineraryActivity using partial update
        ItineraryActivity partialUpdatedItineraryActivity = new ItineraryActivity();
        partialUpdatedItineraryActivity.setId(itineraryActivity.getId());

        partialUpdatedItineraryActivity
            .activityName(UPDATED_ACTIVITY_NAME)
            .activityCost(UPDATED_ACTIVITY_COST)
            .activityHost(UPDATED_ACTIVITY_HOST)
            .activityTime(UPDATED_ACTIVITY_TIME);

        restItineraryActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryActivity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryActivity))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
        ItineraryActivity testItineraryActivity = itineraryActivityList.get(itineraryActivityList.size() - 1);
        assertThat(testItineraryActivity.getActivityName()).isEqualTo(UPDATED_ACTIVITY_NAME);
        assertThat(testItineraryActivity.getActivityCost()).isEqualTo(UPDATED_ACTIVITY_COST);
        assertThat(testItineraryActivity.getActivityHost()).isEqualTo(UPDATED_ACTIVITY_HOST);
        assertThat(testItineraryActivity.getActivityTime()).isEqualTo(UPDATED_ACTIVITY_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingItineraryActivity() throws Exception {
        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();
        itineraryActivity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itineraryActivity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItineraryActivity() throws Exception {
        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();
        itineraryActivity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItineraryActivity() throws Exception {
        int databaseSizeBeforeUpdate = itineraryActivityRepository.findAll().size();
        itineraryActivity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryActivityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryActivity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryActivity in the database
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItineraryActivity() throws Exception {
        // Initialize the database
        itineraryActivityRepository.saveAndFlush(itineraryActivity);

        int databaseSizeBeforeDelete = itineraryActivityRepository.findAll().size();

        // Delete the itineraryActivity
        restItineraryActivityMockMvc
            .perform(delete(ENTITY_API_URL_ID, itineraryActivity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItineraryActivity> itineraryActivityList = itineraryActivityRepository.findAll();
        assertThat(itineraryActivityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
