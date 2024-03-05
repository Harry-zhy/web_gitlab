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
import team.bham.domain.Feedbacks;
import team.bham.repository.FeedbacksRepository;

/**
 * Integration tests for the {@link FeedbacksResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FeedbacksResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_USER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_USER_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/feedbacks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FeedbacksRepository feedbacksRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFeedbacksMockMvc;

    private Feedbacks feedbacks;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Feedbacks createEntity(EntityManager em) {
        Feedbacks feedbacks = new Feedbacks().date(DEFAULT_DATE).userName(DEFAULT_USER_NAME);
        return feedbacks;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Feedbacks createUpdatedEntity(EntityManager em) {
        Feedbacks feedbacks = new Feedbacks().date(UPDATED_DATE).userName(UPDATED_USER_NAME);
        return feedbacks;
    }

    @BeforeEach
    public void initTest() {
        feedbacks = createEntity(em);
    }

    @Test
    @Transactional
    void createFeedbacks() throws Exception {
        int databaseSizeBeforeCreate = feedbacksRepository.findAll().size();
        // Create the Feedbacks
        restFeedbacksMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(feedbacks)))
            .andExpect(status().isCreated());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeCreate + 1);
        Feedbacks testFeedbacks = feedbacksList.get(feedbacksList.size() - 1);
        assertThat(testFeedbacks.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testFeedbacks.getUserName()).isEqualTo(DEFAULT_USER_NAME);
    }

    @Test
    @Transactional
    void createFeedbacksWithExistingId() throws Exception {
        // Create the Feedbacks with an existing ID
        feedbacks.setId(1L);

        int databaseSizeBeforeCreate = feedbacksRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFeedbacksMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(feedbacks)))
            .andExpect(status().isBadRequest());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = feedbacksRepository.findAll().size();
        // set the field null
        feedbacks.setDate(null);

        // Create the Feedbacks, which fails.

        restFeedbacksMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(feedbacks)))
            .andExpect(status().isBadRequest());

        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkUserNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = feedbacksRepository.findAll().size();
        // set the field null
        feedbacks.setUserName(null);

        // Create the Feedbacks, which fails.

        restFeedbacksMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(feedbacks)))
            .andExpect(status().isBadRequest());

        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFeedbacks() throws Exception {
        // Initialize the database
        feedbacksRepository.saveAndFlush(feedbacks);

        // Get all the feedbacksList
        restFeedbacksMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(feedbacks.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].userName").value(hasItem(DEFAULT_USER_NAME)));
    }

    @Test
    @Transactional
    void getFeedbacks() throws Exception {
        // Initialize the database
        feedbacksRepository.saveAndFlush(feedbacks);

        // Get the feedbacks
        restFeedbacksMockMvc
            .perform(get(ENTITY_API_URL_ID, feedbacks.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(feedbacks.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.userName").value(DEFAULT_USER_NAME));
    }

    @Test
    @Transactional
    void getNonExistingFeedbacks() throws Exception {
        // Get the feedbacks
        restFeedbacksMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFeedbacks() throws Exception {
        // Initialize the database
        feedbacksRepository.saveAndFlush(feedbacks);

        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();

        // Update the feedbacks
        Feedbacks updatedFeedbacks = feedbacksRepository.findById(feedbacks.getId()).get();
        // Disconnect from session so that the updates on updatedFeedbacks are not directly saved in db
        em.detach(updatedFeedbacks);
        updatedFeedbacks.date(UPDATED_DATE).userName(UPDATED_USER_NAME);

        restFeedbacksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFeedbacks.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFeedbacks))
            )
            .andExpect(status().isOk());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
        Feedbacks testFeedbacks = feedbacksList.get(feedbacksList.size() - 1);
        assertThat(testFeedbacks.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFeedbacks.getUserName()).isEqualTo(UPDATED_USER_NAME);
    }

    @Test
    @Transactional
    void putNonExistingFeedbacks() throws Exception {
        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();
        feedbacks.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeedbacksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, feedbacks.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedbacks))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFeedbacks() throws Exception {
        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();
        feedbacks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeedbacksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(feedbacks))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFeedbacks() throws Exception {
        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();
        feedbacks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeedbacksMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(feedbacks)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFeedbacksWithPatch() throws Exception {
        // Initialize the database
        feedbacksRepository.saveAndFlush(feedbacks);

        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();

        // Update the feedbacks using partial update
        Feedbacks partialUpdatedFeedbacks = new Feedbacks();
        partialUpdatedFeedbacks.setId(feedbacks.getId());

        partialUpdatedFeedbacks.userName(UPDATED_USER_NAME);

        restFeedbacksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeedbacks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeedbacks))
            )
            .andExpect(status().isOk());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
        Feedbacks testFeedbacks = feedbacksList.get(feedbacksList.size() - 1);
        assertThat(testFeedbacks.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testFeedbacks.getUserName()).isEqualTo(UPDATED_USER_NAME);
    }

    @Test
    @Transactional
    void fullUpdateFeedbacksWithPatch() throws Exception {
        // Initialize the database
        feedbacksRepository.saveAndFlush(feedbacks);

        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();

        // Update the feedbacks using partial update
        Feedbacks partialUpdatedFeedbacks = new Feedbacks();
        partialUpdatedFeedbacks.setId(feedbacks.getId());

        partialUpdatedFeedbacks.date(UPDATED_DATE).userName(UPDATED_USER_NAME);

        restFeedbacksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFeedbacks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFeedbacks))
            )
            .andExpect(status().isOk());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
        Feedbacks testFeedbacks = feedbacksList.get(feedbacksList.size() - 1);
        assertThat(testFeedbacks.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testFeedbacks.getUserName()).isEqualTo(UPDATED_USER_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingFeedbacks() throws Exception {
        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();
        feedbacks.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFeedbacksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, feedbacks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feedbacks))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFeedbacks() throws Exception {
        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();
        feedbacks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeedbacksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(feedbacks))
            )
            .andExpect(status().isBadRequest());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFeedbacks() throws Exception {
        int databaseSizeBeforeUpdate = feedbacksRepository.findAll().size();
        feedbacks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFeedbacksMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(feedbacks))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Feedbacks in the database
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFeedbacks() throws Exception {
        // Initialize the database
        feedbacksRepository.saveAndFlush(feedbacks);

        int databaseSizeBeforeDelete = feedbacksRepository.findAll().size();

        // Delete the feedbacks
        restFeedbacksMockMvc
            .perform(delete(ENTITY_API_URL_ID, feedbacks.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Feedbacks> feedbacksList = feedbacksRepository.findAll();
        assertThat(feedbacksList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
