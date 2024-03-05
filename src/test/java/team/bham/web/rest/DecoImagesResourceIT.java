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
import team.bham.domain.DecoImages;
import team.bham.repository.DecoImagesRepository;

/**
 * Integration tests for the {@link DecoImagesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DecoImagesResourceIT {

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/deco-images";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecoImagesRepository decoImagesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecoImagesMockMvc;

    private DecoImages decoImages;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoImages createEntity(EntityManager em) {
        DecoImages decoImages = new DecoImages().picture(DEFAULT_PICTURE).pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE);
        return decoImages;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoImages createUpdatedEntity(EntityManager em) {
        DecoImages decoImages = new DecoImages().picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);
        return decoImages;
    }

    @BeforeEach
    public void initTest() {
        decoImages = createEntity(em);
    }

    @Test
    @Transactional
    void createDecoImages() throws Exception {
        int databaseSizeBeforeCreate = decoImagesRepository.findAll().size();
        // Create the DecoImages
        restDecoImagesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoImages)))
            .andExpect(status().isCreated());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeCreate + 1);
        DecoImages testDecoImages = decoImagesList.get(decoImagesList.size() - 1);
        assertThat(testDecoImages.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testDecoImages.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createDecoImagesWithExistingId() throws Exception {
        // Create the DecoImages with an existing ID
        decoImages.setId(1L);

        int databaseSizeBeforeCreate = decoImagesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecoImagesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoImages)))
            .andExpect(status().isBadRequest());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDecoImages() throws Exception {
        // Initialize the database
        decoImagesRepository.saveAndFlush(decoImages);

        // Get all the decoImagesList
        restDecoImagesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decoImages.getId().intValue())))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))));
    }

    @Test
    @Transactional
    void getDecoImages() throws Exception {
        // Initialize the database
        decoImagesRepository.saveAndFlush(decoImages);

        // Get the decoImages
        restDecoImagesMockMvc
            .perform(get(ENTITY_API_URL_ID, decoImages.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decoImages.getId().intValue()))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)));
    }

    @Test
    @Transactional
    void getNonExistingDecoImages() throws Exception {
        // Get the decoImages
        restDecoImagesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecoImages() throws Exception {
        // Initialize the database
        decoImagesRepository.saveAndFlush(decoImages);

        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();

        // Update the decoImages
        DecoImages updatedDecoImages = decoImagesRepository.findById(decoImages.getId()).get();
        // Disconnect from session so that the updates on updatedDecoImages are not directly saved in db
        em.detach(updatedDecoImages);
        updatedDecoImages.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restDecoImagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecoImages.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecoImages))
            )
            .andExpect(status().isOk());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
        DecoImages testDecoImages = decoImagesList.get(decoImagesList.size() - 1);
        assertThat(testDecoImages.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testDecoImages.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingDecoImages() throws Exception {
        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();
        decoImages.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoImagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decoImages.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecoImages() throws Exception {
        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();
        decoImages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoImagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecoImages() throws Exception {
        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();
        decoImages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoImagesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoImages)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecoImagesWithPatch() throws Exception {
        // Initialize the database
        decoImagesRepository.saveAndFlush(decoImages);

        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();

        // Update the decoImages using partial update
        DecoImages partialUpdatedDecoImages = new DecoImages();
        partialUpdatedDecoImages.setId(decoImages.getId());

        partialUpdatedDecoImages.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restDecoImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoImages.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoImages))
            )
            .andExpect(status().isOk());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
        DecoImages testDecoImages = decoImagesList.get(decoImagesList.size() - 1);
        assertThat(testDecoImages.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testDecoImages.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateDecoImagesWithPatch() throws Exception {
        // Initialize the database
        decoImagesRepository.saveAndFlush(decoImages);

        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();

        // Update the decoImages using partial update
        DecoImages partialUpdatedDecoImages = new DecoImages();
        partialUpdatedDecoImages.setId(decoImages.getId());

        partialUpdatedDecoImages.picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restDecoImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoImages.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoImages))
            )
            .andExpect(status().isOk());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
        DecoImages testDecoImages = decoImagesList.get(decoImagesList.size() - 1);
        assertThat(testDecoImages.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testDecoImages.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingDecoImages() throws Exception {
        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();
        decoImages.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decoImages.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecoImages() throws Exception {
        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();
        decoImages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoImages))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecoImages() throws Exception {
        int databaseSizeBeforeUpdate = decoImagesRepository.findAll().size();
        decoImages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoImagesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(decoImages))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoImages in the database
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecoImages() throws Exception {
        // Initialize the database
        decoImagesRepository.saveAndFlush(decoImages);

        int databaseSizeBeforeDelete = decoImagesRepository.findAll().size();

        // Delete the decoImages
        restDecoImagesMockMvc
            .perform(delete(ENTITY_API_URL_ID, decoImages.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DecoImages> decoImagesList = decoImagesRepository.findAll();
        assertThat(decoImagesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
