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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.ActivityImage;
import team.bham.repository.ActivityImageRepository;

/**
 * Integration tests for the {@link ActivityImageResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActivityImageResourceIT {

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/activity-images";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActivityImageRepository activityImageRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivityImageMockMvc;

    private ActivityImage activityImage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityImage createEntity(EntityManager em) {
        ActivityImage activityImage = new ActivityImage().picture(DEFAULT_PICTURE).pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE);
        return activityImage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityImage createUpdatedEntity(EntityManager em) {
        ActivityImage activityImage = new ActivityImage().picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);
        return activityImage;
    }

    @BeforeEach
    public void initTest() {
        activityImage = createEntity(em);
    }

    @Test
    @Transactional
    void createActivityImage() throws Exception {
        int databaseSizeBeforeCreate = activityImageRepository.findAll().size();
        // Create the ActivityImage
        restActivityImageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityImage)))
            .andExpect(status().isCreated());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeCreate + 1);
        ActivityImage testActivityImage = activityImageList.get(activityImageList.size() - 1);
        assertThat(testActivityImage.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testActivityImage.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createActivityImageWithExistingId() throws Exception {
        // Create the ActivityImage with an existing ID
        activityImage.setId(1L);

        int databaseSizeBeforeCreate = activityImageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivityImageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityImage)))
            .andExpect(status().isBadRequest());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllActivityImages() throws Exception {
        // Initialize the database
        activityImageRepository.saveAndFlush(activityImage);

        // Get all the activityImageList
        restActivityImageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activityImage.getId().intValue())))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))));
    }

    @Test
    @Transactional
    void getActivityImage() throws Exception {
        // Initialize the database
        activityImageRepository.saveAndFlush(activityImage);

        // Get the activityImage
        restActivityImageMockMvc
            .perform(get(ENTITY_API_URL_ID, activityImage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activityImage.getId().intValue()))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)));
    }

    @Test
    @Transactional
    void getNonExistingActivityImage() throws Exception {
        // Get the activityImage
        restActivityImageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActivityImage() throws Exception {
        // Initialize the database
        activityImageRepository.saveAndFlush(activityImage);

        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();

        // Update the activityImage
        ActivityImage updatedActivityImage = activityImageRepository.findById(activityImage.getId()).get();
        // Disconnect from session so that the updates on updatedActivityImage are not directly saved in db
        em.detach(updatedActivityImage);
        updatedActivityImage.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restActivityImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivityImage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivityImage))
            )
            .andExpect(status().isOk());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
        ActivityImage testActivityImage = activityImageList.get(activityImageList.size() - 1);
        assertThat(testActivityImage.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testActivityImage.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingActivityImage() throws Exception {
        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();
        activityImage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activityImage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivityImage() throws Exception {
        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();
        activityImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityImageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivityImage() throws Exception {
        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();
        activityImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityImageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityImage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActivityImageWithPatch() throws Exception {
        // Initialize the database
        activityImageRepository.saveAndFlush(activityImage);

        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();

        // Update the activityImage using partial update
        ActivityImage partialUpdatedActivityImage = new ActivityImage();
        partialUpdatedActivityImage.setId(activityImage.getId());

        partialUpdatedActivityImage.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restActivityImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityImage))
            )
            .andExpect(status().isOk());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
        ActivityImage testActivityImage = activityImageList.get(activityImageList.size() - 1);
        assertThat(testActivityImage.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testActivityImage.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateActivityImageWithPatch() throws Exception {
        // Initialize the database
        activityImageRepository.saveAndFlush(activityImage);

        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();

        // Update the activityImage using partial update
        ActivityImage partialUpdatedActivityImage = new ActivityImage();
        partialUpdatedActivityImage.setId(activityImage.getId());

        partialUpdatedActivityImage.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restActivityImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityImage))
            )
            .andExpect(status().isOk());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
        ActivityImage testActivityImage = activityImageList.get(activityImageList.size() - 1);
        assertThat(testActivityImage.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testActivityImage.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingActivityImage() throws Exception {
        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();
        activityImage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activityImage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivityImage() throws Exception {
        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();
        activityImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityImageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityImage))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivityImage() throws Exception {
        int databaseSizeBeforeUpdate = activityImageRepository.findAll().size();
        activityImage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityImageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(activityImage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityImage in the database
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivityImage() throws Exception {
        // Initialize the database
        activityImageRepository.saveAndFlush(activityImage);

        int databaseSizeBeforeDelete = activityImageRepository.findAll().size();

        // Delete the activityImage
        restActivityImageMockMvc
            .perform(delete(ENTITY_API_URL_ID, activityImage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActivityImage> activityImageList = activityImageRepository.findAll();
        assertThat(activityImageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
