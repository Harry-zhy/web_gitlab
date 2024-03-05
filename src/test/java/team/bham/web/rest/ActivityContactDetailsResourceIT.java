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
import team.bham.domain.ActivityContactDetails;
import team.bham.repository.ActivityContactDetailsRepository;

/**
 * Integration tests for the {@link ActivityContactDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActivityContactDetailsResourceIT {

    private static final String DEFAULT_WEBSITE = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE = "BBBBBBBBBB";

    private static final String DEFAULT_TWITTER = "AAAAAAAAAA";
    private static final String UPDATED_TWITTER = "BBBBBBBBBB";

    private static final String DEFAULT_INSTAGRAM = "AAAAAAAAAA";
    private static final String UPDATED_INSTAGRAM = "BBBBBBBBBB";

    private static final String DEFAULT_FACEBOOK = "AAAAAAAAAA";
    private static final String UPDATED_FACEBOOK = "BBBBBBBBBB";

    private static final String DEFAULT_TIKTOK = "AAAAAAAAAA";
    private static final String UPDATED_TIKTOK = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/activity-contact-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActivityContactDetailsRepository activityContactDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivityContactDetailsMockMvc;

    private ActivityContactDetails activityContactDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityContactDetails createEntity(EntityManager em) {
        ActivityContactDetails activityContactDetails = new ActivityContactDetails()
            .website(DEFAULT_WEBSITE)
            .twitter(DEFAULT_TWITTER)
            .instagram(DEFAULT_INSTAGRAM)
            .facebook(DEFAULT_FACEBOOK)
            .tiktok(DEFAULT_TIKTOK)
            .phoneNumber(DEFAULT_PHONE_NUMBER);
        return activityContactDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityContactDetails createUpdatedEntity(EntityManager em) {
        ActivityContactDetails activityContactDetails = new ActivityContactDetails()
            .website(UPDATED_WEBSITE)
            .twitter(UPDATED_TWITTER)
            .instagram(UPDATED_INSTAGRAM)
            .facebook(UPDATED_FACEBOOK)
            .tiktok(UPDATED_TIKTOK)
            .phoneNumber(UPDATED_PHONE_NUMBER);
        return activityContactDetails;
    }

    @BeforeEach
    public void initTest() {
        activityContactDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createActivityContactDetails() throws Exception {
        int databaseSizeBeforeCreate = activityContactDetailsRepository.findAll().size();
        // Create the ActivityContactDetails
        restActivityContactDetailsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityContactDetails))
            )
            .andExpect(status().isCreated());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        ActivityContactDetails testActivityContactDetails = activityContactDetailsList.get(activityContactDetailsList.size() - 1);
        assertThat(testActivityContactDetails.getWebsite()).isEqualTo(DEFAULT_WEBSITE);
        assertThat(testActivityContactDetails.getTwitter()).isEqualTo(DEFAULT_TWITTER);
        assertThat(testActivityContactDetails.getInstagram()).isEqualTo(DEFAULT_INSTAGRAM);
        assertThat(testActivityContactDetails.getFacebook()).isEqualTo(DEFAULT_FACEBOOK);
        assertThat(testActivityContactDetails.getTiktok()).isEqualTo(DEFAULT_TIKTOK);
        assertThat(testActivityContactDetails.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void createActivityContactDetailsWithExistingId() throws Exception {
        // Create the ActivityContactDetails with an existing ID
        activityContactDetails.setId(1L);

        int databaseSizeBeforeCreate = activityContactDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivityContactDetailsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActivityContactDetails() throws Exception {
        // Initialize the database
        activityContactDetailsRepository.saveAndFlush(activityContactDetails);

        // Get all the activityContactDetailsList
        restActivityContactDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activityContactDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].website").value(hasItem(DEFAULT_WEBSITE)))
            .andExpect(jsonPath("$.[*].twitter").value(hasItem(DEFAULT_TWITTER)))
            .andExpect(jsonPath("$.[*].instagram").value(hasItem(DEFAULT_INSTAGRAM)))
            .andExpect(jsonPath("$.[*].facebook").value(hasItem(DEFAULT_FACEBOOK)))
            .andExpect(jsonPath("$.[*].tiktok").value(hasItem(DEFAULT_TIKTOK)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)));
    }

    @Test
    @Transactional
    void getActivityContactDetails() throws Exception {
        // Initialize the database
        activityContactDetailsRepository.saveAndFlush(activityContactDetails);

        // Get the activityContactDetails
        restActivityContactDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, activityContactDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activityContactDetails.getId().intValue()))
            .andExpect(jsonPath("$.website").value(DEFAULT_WEBSITE))
            .andExpect(jsonPath("$.twitter").value(DEFAULT_TWITTER))
            .andExpect(jsonPath("$.instagram").value(DEFAULT_INSTAGRAM))
            .andExpect(jsonPath("$.facebook").value(DEFAULT_FACEBOOK))
            .andExpect(jsonPath("$.tiktok").value(DEFAULT_TIKTOK))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingActivityContactDetails() throws Exception {
        // Get the activityContactDetails
        restActivityContactDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActivityContactDetails() throws Exception {
        // Initialize the database
        activityContactDetailsRepository.saveAndFlush(activityContactDetails);

        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();

        // Update the activityContactDetails
        ActivityContactDetails updatedActivityContactDetails = activityContactDetailsRepository
            .findById(activityContactDetails.getId())
            .get();
        // Disconnect from session so that the updates on updatedActivityContactDetails are not directly saved in db
        em.detach(updatedActivityContactDetails);
        updatedActivityContactDetails
            .website(UPDATED_WEBSITE)
            .twitter(UPDATED_TWITTER)
            .instagram(UPDATED_INSTAGRAM)
            .facebook(UPDATED_FACEBOOK)
            .tiktok(UPDATED_TIKTOK)
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restActivityContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivityContactDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivityContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
        ActivityContactDetails testActivityContactDetails = activityContactDetailsList.get(activityContactDetailsList.size() - 1);
        assertThat(testActivityContactDetails.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testActivityContactDetails.getTwitter()).isEqualTo(UPDATED_TWITTER);
        assertThat(testActivityContactDetails.getInstagram()).isEqualTo(UPDATED_INSTAGRAM);
        assertThat(testActivityContactDetails.getFacebook()).isEqualTo(UPDATED_FACEBOOK);
        assertThat(testActivityContactDetails.getTiktok()).isEqualTo(UPDATED_TIKTOK);
        assertThat(testActivityContactDetails.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingActivityContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();
        activityContactDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activityContactDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivityContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();
        activityContactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivityContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();
        activityContactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityContactDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActivityContactDetailsWithPatch() throws Exception {
        // Initialize the database
        activityContactDetailsRepository.saveAndFlush(activityContactDetails);

        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();

        // Update the activityContactDetails using partial update
        ActivityContactDetails partialUpdatedActivityContactDetails = new ActivityContactDetails();
        partialUpdatedActivityContactDetails.setId(activityContactDetails.getId());

        partialUpdatedActivityContactDetails.tiktok(UPDATED_TIKTOK);

        restActivityContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityContactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
        ActivityContactDetails testActivityContactDetails = activityContactDetailsList.get(activityContactDetailsList.size() - 1);
        assertThat(testActivityContactDetails.getWebsite()).isEqualTo(DEFAULT_WEBSITE);
        assertThat(testActivityContactDetails.getTwitter()).isEqualTo(DEFAULT_TWITTER);
        assertThat(testActivityContactDetails.getInstagram()).isEqualTo(DEFAULT_INSTAGRAM);
        assertThat(testActivityContactDetails.getFacebook()).isEqualTo(DEFAULT_FACEBOOK);
        assertThat(testActivityContactDetails.getTiktok()).isEqualTo(UPDATED_TIKTOK);
        assertThat(testActivityContactDetails.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateActivityContactDetailsWithPatch() throws Exception {
        // Initialize the database
        activityContactDetailsRepository.saveAndFlush(activityContactDetails);

        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();

        // Update the activityContactDetails using partial update
        ActivityContactDetails partialUpdatedActivityContactDetails = new ActivityContactDetails();
        partialUpdatedActivityContactDetails.setId(activityContactDetails.getId());

        partialUpdatedActivityContactDetails
            .website(UPDATED_WEBSITE)
            .twitter(UPDATED_TWITTER)
            .instagram(UPDATED_INSTAGRAM)
            .facebook(UPDATED_FACEBOOK)
            .tiktok(UPDATED_TIKTOK)
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restActivityContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityContactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
        ActivityContactDetails testActivityContactDetails = activityContactDetailsList.get(activityContactDetailsList.size() - 1);
        assertThat(testActivityContactDetails.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testActivityContactDetails.getTwitter()).isEqualTo(UPDATED_TWITTER);
        assertThat(testActivityContactDetails.getInstagram()).isEqualTo(UPDATED_INSTAGRAM);
        assertThat(testActivityContactDetails.getFacebook()).isEqualTo(UPDATED_FACEBOOK);
        assertThat(testActivityContactDetails.getTiktok()).isEqualTo(UPDATED_TIKTOK);
        assertThat(testActivityContactDetails.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingActivityContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();
        activityContactDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activityContactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivityContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();
        activityContactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivityContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = activityContactDetailsRepository.findAll().size();
        activityContactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityContactDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityContactDetails in the database
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivityContactDetails() throws Exception {
        // Initialize the database
        activityContactDetailsRepository.saveAndFlush(activityContactDetails);

        int databaseSizeBeforeDelete = activityContactDetailsRepository.findAll().size();

        // Delete the activityContactDetails
        restActivityContactDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, activityContactDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActivityContactDetails> activityContactDetailsList = activityContactDetailsRepository.findAll();
        assertThat(activityContactDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
