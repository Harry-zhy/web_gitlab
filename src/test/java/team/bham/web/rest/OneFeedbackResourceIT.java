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
import team.bham.domain.OneFeedback;
import team.bham.repository.OneFeedbackRepository;

/**
 * Integration tests for the {@link OneFeedbackResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OneFeedbackResourceIT {

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Boolean DEFAULT_WITH_MULTI_MEDIA = false;
    private static final Boolean UPDATED_WITH_MULTI_MEDIA = true;

    private static final String DEFAULT_IMAGE_PATH = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_PATH = "BBBBBBBBBB";

    private static final String DEFAULT_VIDEO_PATH = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO_PATH = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/one-feedbacks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OneFeedbackRepository oneFeedbackRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOneFeedbackMockMvc;

    private OneFeedback oneFeedback;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OneFeedback createEntity(EntityManager em) {
        OneFeedback oneFeedback = new OneFeedback()
            .content(DEFAULT_CONTENT)
            .withMultiMedia(DEFAULT_WITH_MULTI_MEDIA)
            .imagePath(DEFAULT_IMAGE_PATH)
            .videoPath(DEFAULT_VIDEO_PATH);
        return oneFeedback;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OneFeedback createUpdatedEntity(EntityManager em) {
        OneFeedback oneFeedback = new OneFeedback()
            .content(UPDATED_CONTENT)
            .withMultiMedia(UPDATED_WITH_MULTI_MEDIA)
            .imagePath(UPDATED_IMAGE_PATH)
            .videoPath(UPDATED_VIDEO_PATH);
        return oneFeedback;
    }

    @BeforeEach
    public void initTest() {
        oneFeedback = createEntity(em);
    }

    @Test
    @Transactional
    void createOneFeedback() throws Exception {
        int databaseSizeBeforeCreate = oneFeedbackRepository.findAll().size();
        // Create the OneFeedback
        restOneFeedbackMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(oneFeedback)))
            .andExpect(status().isCreated());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeCreate + 1);
        OneFeedback testOneFeedback = oneFeedbackList.get(oneFeedbackList.size() - 1);
        assertThat(testOneFeedback.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testOneFeedback.getWithMultiMedia()).isEqualTo(DEFAULT_WITH_MULTI_MEDIA);
        assertThat(testOneFeedback.getImagePath()).isEqualTo(DEFAULT_IMAGE_PATH);
        assertThat(testOneFeedback.getVideoPath()).isEqualTo(DEFAULT_VIDEO_PATH);
    }

    @Test
    @Transactional
    void createOneFeedbackWithExistingId() throws Exception {
        // Create the OneFeedback with an existing ID
        oneFeedback.setId(1L);

        int databaseSizeBeforeCreate = oneFeedbackRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOneFeedbackMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(oneFeedback)))
            .andExpect(status().isBadRequest());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkContentIsRequired() throws Exception {
        int databaseSizeBeforeTest = oneFeedbackRepository.findAll().size();
        // set the field null
        oneFeedback.setContent(null);

        // Create the OneFeedback, which fails.

        restOneFeedbackMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(oneFeedback)))
            .andExpect(status().isBadRequest());

        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkWithMultiMediaIsRequired() throws Exception {
        int databaseSizeBeforeTest = oneFeedbackRepository.findAll().size();
        // set the field null
        oneFeedback.setWithMultiMedia(null);

        // Create the OneFeedback, which fails.

        restOneFeedbackMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(oneFeedback)))
            .andExpect(status().isBadRequest());

        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOneFeedbacks() throws Exception {
        // Initialize the database
        oneFeedbackRepository.saveAndFlush(oneFeedback);

        // Get all the oneFeedbackList
        restOneFeedbackMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(oneFeedback.getId().intValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].withMultiMedia").value(hasItem(DEFAULT_WITH_MULTI_MEDIA.booleanValue())))
            .andExpect(jsonPath("$.[*].imagePath").value(hasItem(DEFAULT_IMAGE_PATH)))
            .andExpect(jsonPath("$.[*].videoPath").value(hasItem(DEFAULT_VIDEO_PATH)));
    }

    @Test
    @Transactional
    void getOneFeedback() throws Exception {
        // Initialize the database
        oneFeedbackRepository.saveAndFlush(oneFeedback);

        // Get the oneFeedback
        restOneFeedbackMockMvc
            .perform(get(ENTITY_API_URL_ID, oneFeedback.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(oneFeedback.getId().intValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.withMultiMedia").value(DEFAULT_WITH_MULTI_MEDIA.booleanValue()))
            .andExpect(jsonPath("$.imagePath").value(DEFAULT_IMAGE_PATH))
            .andExpect(jsonPath("$.videoPath").value(DEFAULT_VIDEO_PATH));
    }

    @Test
    @Transactional
    void getNonExistingOneFeedback() throws Exception {
        // Get the oneFeedback
        restOneFeedbackMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOneFeedback() throws Exception {
        // Initialize the database
        oneFeedbackRepository.saveAndFlush(oneFeedback);

        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();

        // Update the oneFeedback
        OneFeedback updatedOneFeedback = oneFeedbackRepository.findById(oneFeedback.getId()).get();
        // Disconnect from session so that the updates on updatedOneFeedback are not directly saved in db
        em.detach(updatedOneFeedback);
        updatedOneFeedback
            .content(UPDATED_CONTENT)
            .withMultiMedia(UPDATED_WITH_MULTI_MEDIA)
            .imagePath(UPDATED_IMAGE_PATH)
            .videoPath(UPDATED_VIDEO_PATH);

        restOneFeedbackMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOneFeedback.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOneFeedback))
            )
            .andExpect(status().isOk());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
        OneFeedback testOneFeedback = oneFeedbackList.get(oneFeedbackList.size() - 1);
        assertThat(testOneFeedback.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testOneFeedback.getWithMultiMedia()).isEqualTo(UPDATED_WITH_MULTI_MEDIA);
        assertThat(testOneFeedback.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
        assertThat(testOneFeedback.getVideoPath()).isEqualTo(UPDATED_VIDEO_PATH);
    }

    @Test
    @Transactional
    void putNonExistingOneFeedback() throws Exception {
        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();
        oneFeedback.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOneFeedbackMockMvc
            .perform(
                put(ENTITY_API_URL_ID, oneFeedback.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(oneFeedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOneFeedback() throws Exception {
        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();
        oneFeedback.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOneFeedbackMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(oneFeedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOneFeedback() throws Exception {
        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();
        oneFeedback.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOneFeedbackMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(oneFeedback)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOneFeedbackWithPatch() throws Exception {
        // Initialize the database
        oneFeedbackRepository.saveAndFlush(oneFeedback);

        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();

        // Update the oneFeedback using partial update
        OneFeedback partialUpdatedOneFeedback = new OneFeedback();
        partialUpdatedOneFeedback.setId(oneFeedback.getId());

        restOneFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOneFeedback.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOneFeedback))
            )
            .andExpect(status().isOk());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
        OneFeedback testOneFeedback = oneFeedbackList.get(oneFeedbackList.size() - 1);
        assertThat(testOneFeedback.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testOneFeedback.getWithMultiMedia()).isEqualTo(DEFAULT_WITH_MULTI_MEDIA);
        assertThat(testOneFeedback.getImagePath()).isEqualTo(DEFAULT_IMAGE_PATH);
        assertThat(testOneFeedback.getVideoPath()).isEqualTo(DEFAULT_VIDEO_PATH);
    }

    @Test
    @Transactional
    void fullUpdateOneFeedbackWithPatch() throws Exception {
        // Initialize the database
        oneFeedbackRepository.saveAndFlush(oneFeedback);

        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();

        // Update the oneFeedback using partial update
        OneFeedback partialUpdatedOneFeedback = new OneFeedback();
        partialUpdatedOneFeedback.setId(oneFeedback.getId());

        partialUpdatedOneFeedback
            .content(UPDATED_CONTENT)
            .withMultiMedia(UPDATED_WITH_MULTI_MEDIA)
            .imagePath(UPDATED_IMAGE_PATH)
            .videoPath(UPDATED_VIDEO_PATH);

        restOneFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOneFeedback.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOneFeedback))
            )
            .andExpect(status().isOk());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
        OneFeedback testOneFeedback = oneFeedbackList.get(oneFeedbackList.size() - 1);
        assertThat(testOneFeedback.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testOneFeedback.getWithMultiMedia()).isEqualTo(UPDATED_WITH_MULTI_MEDIA);
        assertThat(testOneFeedback.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
        assertThat(testOneFeedback.getVideoPath()).isEqualTo(UPDATED_VIDEO_PATH);
    }

    @Test
    @Transactional
    void patchNonExistingOneFeedback() throws Exception {
        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();
        oneFeedback.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOneFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, oneFeedback.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(oneFeedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOneFeedback() throws Exception {
        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();
        oneFeedback.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOneFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(oneFeedback))
            )
            .andExpect(status().isBadRequest());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOneFeedback() throws Exception {
        int databaseSizeBeforeUpdate = oneFeedbackRepository.findAll().size();
        oneFeedback.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOneFeedbackMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(oneFeedback))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OneFeedback in the database
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOneFeedback() throws Exception {
        // Initialize the database
        oneFeedbackRepository.saveAndFlush(oneFeedback);

        int databaseSizeBeforeDelete = oneFeedbackRepository.findAll().size();

        // Delete the oneFeedback
        restOneFeedbackMockMvc
            .perform(delete(ENTITY_API_URL_ID, oneFeedback.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OneFeedback> oneFeedbackList = oneFeedbackRepository.findAll();
        assertThat(oneFeedbackList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
