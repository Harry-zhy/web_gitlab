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
import team.bham.domain.DecoContactDetails;
import team.bham.repository.DecoContactDetailsRepository;

/**
 * Integration tests for the {@link DecoContactDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DecoContactDetailsResourceIT {

    private static final String DEFAULT_WEBSITE = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_INSTAGRAM = "AAAAAAAAAA";
    private static final String UPDATED_INSTAGRAM = "BBBBBBBBBB";

    private static final String DEFAULT_TWITTER = "AAAAAAAAAA";
    private static final String UPDATED_TWITTER = "BBBBBBBBBB";

    private static final String DEFAULT_FACEBOOK = "AAAAAAAAAA";
    private static final String UPDATED_FACEBOOK = "BBBBBBBBBB";

    private static final String DEFAULT_TIKTOK = "AAAAAAAAAA";
    private static final String UPDATED_TIKTOK = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/deco-contact-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecoContactDetailsRepository decoContactDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecoContactDetailsMockMvc;

    private DecoContactDetails decoContactDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoContactDetails createEntity(EntityManager em) {
        DecoContactDetails decoContactDetails = new DecoContactDetails()
            .website(DEFAULT_WEBSITE)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .instagram(DEFAULT_INSTAGRAM)
            .twitter(DEFAULT_TWITTER)
            .facebook(DEFAULT_FACEBOOK)
            .tiktok(DEFAULT_TIKTOK);
        return decoContactDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoContactDetails createUpdatedEntity(EntityManager em) {
        DecoContactDetails decoContactDetails = new DecoContactDetails()
            .website(UPDATED_WEBSITE)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .instagram(UPDATED_INSTAGRAM)
            .twitter(UPDATED_TWITTER)
            .facebook(UPDATED_FACEBOOK)
            .tiktok(UPDATED_TIKTOK);
        return decoContactDetails;
    }

    @BeforeEach
    public void initTest() {
        decoContactDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createDecoContactDetails() throws Exception {
        int databaseSizeBeforeCreate = decoContactDetailsRepository.findAll().size();
        // Create the DecoContactDetails
        restDecoContactDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoContactDetails))
            )
            .andExpect(status().isCreated());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        DecoContactDetails testDecoContactDetails = decoContactDetailsList.get(decoContactDetailsList.size() - 1);
        assertThat(testDecoContactDetails.getWebsite()).isEqualTo(DEFAULT_WEBSITE);
        assertThat(testDecoContactDetails.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testDecoContactDetails.getInstagram()).isEqualTo(DEFAULT_INSTAGRAM);
        assertThat(testDecoContactDetails.getTwitter()).isEqualTo(DEFAULT_TWITTER);
        assertThat(testDecoContactDetails.getFacebook()).isEqualTo(DEFAULT_FACEBOOK);
        assertThat(testDecoContactDetails.getTiktok()).isEqualTo(DEFAULT_TIKTOK);
    }

    @Test
    @Transactional
    void createDecoContactDetailsWithExistingId() throws Exception {
        // Create the DecoContactDetails with an existing ID
        decoContactDetails.setId(1L);

        int databaseSizeBeforeCreate = decoContactDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecoContactDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDecoContactDetails() throws Exception {
        // Initialize the database
        decoContactDetailsRepository.saveAndFlush(decoContactDetails);

        // Get all the decoContactDetailsList
        restDecoContactDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decoContactDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].website").value(hasItem(DEFAULT_WEBSITE)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].instagram").value(hasItem(DEFAULT_INSTAGRAM)))
            .andExpect(jsonPath("$.[*].twitter").value(hasItem(DEFAULT_TWITTER)))
            .andExpect(jsonPath("$.[*].facebook").value(hasItem(DEFAULT_FACEBOOK)))
            .andExpect(jsonPath("$.[*].tiktok").value(hasItem(DEFAULT_TIKTOK)));
    }

    @Test
    @Transactional
    void getDecoContactDetails() throws Exception {
        // Initialize the database
        decoContactDetailsRepository.saveAndFlush(decoContactDetails);

        // Get the decoContactDetails
        restDecoContactDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, decoContactDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decoContactDetails.getId().intValue()))
            .andExpect(jsonPath("$.website").value(DEFAULT_WEBSITE))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.instagram").value(DEFAULT_INSTAGRAM))
            .andExpect(jsonPath("$.twitter").value(DEFAULT_TWITTER))
            .andExpect(jsonPath("$.facebook").value(DEFAULT_FACEBOOK))
            .andExpect(jsonPath("$.tiktok").value(DEFAULT_TIKTOK));
    }

    @Test
    @Transactional
    void getNonExistingDecoContactDetails() throws Exception {
        // Get the decoContactDetails
        restDecoContactDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecoContactDetails() throws Exception {
        // Initialize the database
        decoContactDetailsRepository.saveAndFlush(decoContactDetails);

        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();

        // Update the decoContactDetails
        DecoContactDetails updatedDecoContactDetails = decoContactDetailsRepository.findById(decoContactDetails.getId()).get();
        // Disconnect from session so that the updates on updatedDecoContactDetails are not directly saved in db
        em.detach(updatedDecoContactDetails);
        updatedDecoContactDetails
            .website(UPDATED_WEBSITE)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .instagram(UPDATED_INSTAGRAM)
            .twitter(UPDATED_TWITTER)
            .facebook(UPDATED_FACEBOOK)
            .tiktok(UPDATED_TIKTOK);

        restDecoContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecoContactDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecoContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
        DecoContactDetails testDecoContactDetails = decoContactDetailsList.get(decoContactDetailsList.size() - 1);
        assertThat(testDecoContactDetails.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testDecoContactDetails.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testDecoContactDetails.getInstagram()).isEqualTo(UPDATED_INSTAGRAM);
        assertThat(testDecoContactDetails.getTwitter()).isEqualTo(UPDATED_TWITTER);
        assertThat(testDecoContactDetails.getFacebook()).isEqualTo(UPDATED_FACEBOOK);
        assertThat(testDecoContactDetails.getTiktok()).isEqualTo(UPDATED_TIKTOK);
    }

    @Test
    @Transactional
    void putNonExistingDecoContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();
        decoContactDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decoContactDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecoContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();
        decoContactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecoContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();
        decoContactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoContactDetailsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoContactDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecoContactDetailsWithPatch() throws Exception {
        // Initialize the database
        decoContactDetailsRepository.saveAndFlush(decoContactDetails);

        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();

        // Update the decoContactDetails using partial update
        DecoContactDetails partialUpdatedDecoContactDetails = new DecoContactDetails();
        partialUpdatedDecoContactDetails.setId(decoContactDetails.getId());

        partialUpdatedDecoContactDetails
            .website(UPDATED_WEBSITE)
            .twitter(UPDATED_TWITTER)
            .facebook(UPDATED_FACEBOOK)
            .tiktok(UPDATED_TIKTOK);

        restDecoContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoContactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
        DecoContactDetails testDecoContactDetails = decoContactDetailsList.get(decoContactDetailsList.size() - 1);
        assertThat(testDecoContactDetails.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testDecoContactDetails.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testDecoContactDetails.getInstagram()).isEqualTo(DEFAULT_INSTAGRAM);
        assertThat(testDecoContactDetails.getTwitter()).isEqualTo(UPDATED_TWITTER);
        assertThat(testDecoContactDetails.getFacebook()).isEqualTo(UPDATED_FACEBOOK);
        assertThat(testDecoContactDetails.getTiktok()).isEqualTo(UPDATED_TIKTOK);
    }

    @Test
    @Transactional
    void fullUpdateDecoContactDetailsWithPatch() throws Exception {
        // Initialize the database
        decoContactDetailsRepository.saveAndFlush(decoContactDetails);

        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();

        // Update the decoContactDetails using partial update
        DecoContactDetails partialUpdatedDecoContactDetails = new DecoContactDetails();
        partialUpdatedDecoContactDetails.setId(decoContactDetails.getId());

        partialUpdatedDecoContactDetails
            .website(UPDATED_WEBSITE)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .instagram(UPDATED_INSTAGRAM)
            .twitter(UPDATED_TWITTER)
            .facebook(UPDATED_FACEBOOK)
            .tiktok(UPDATED_TIKTOK);

        restDecoContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoContactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoContactDetails))
            )
            .andExpect(status().isOk());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
        DecoContactDetails testDecoContactDetails = decoContactDetailsList.get(decoContactDetailsList.size() - 1);
        assertThat(testDecoContactDetails.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testDecoContactDetails.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testDecoContactDetails.getInstagram()).isEqualTo(UPDATED_INSTAGRAM);
        assertThat(testDecoContactDetails.getTwitter()).isEqualTo(UPDATED_TWITTER);
        assertThat(testDecoContactDetails.getFacebook()).isEqualTo(UPDATED_FACEBOOK);
        assertThat(testDecoContactDetails.getTiktok()).isEqualTo(UPDATED_TIKTOK);
    }

    @Test
    @Transactional
    void patchNonExistingDecoContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();
        decoContactDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decoContactDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecoContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();
        decoContactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoContactDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecoContactDetails() throws Exception {
        int databaseSizeBeforeUpdate = decoContactDetailsRepository.findAll().size();
        decoContactDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoContactDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoContactDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoContactDetails in the database
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecoContactDetails() throws Exception {
        // Initialize the database
        decoContactDetailsRepository.saveAndFlush(decoContactDetails);

        int databaseSizeBeforeDelete = decoContactDetailsRepository.findAll().size();

        // Delete the decoContactDetails
        restDecoContactDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, decoContactDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DecoContactDetails> decoContactDetailsList = decoContactDetailsRepository.findAll();
        assertThat(decoContactDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
