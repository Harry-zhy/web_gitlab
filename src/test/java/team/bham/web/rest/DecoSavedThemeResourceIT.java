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
import team.bham.domain.DecoSavedTheme;
import team.bham.repository.DecoSavedThemeRepository;

/**
 * Integration tests for the {@link DecoSavedThemeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DecoSavedThemeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/deco-saved-themes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecoSavedThemeRepository decoSavedThemeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecoSavedThemeMockMvc;

    private DecoSavedTheme decoSavedTheme;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoSavedTheme createEntity(EntityManager em) {
        DecoSavedTheme decoSavedTheme = new DecoSavedTheme().name(DEFAULT_NAME);
        return decoSavedTheme;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoSavedTheme createUpdatedEntity(EntityManager em) {
        DecoSavedTheme decoSavedTheme = new DecoSavedTheme().name(UPDATED_NAME);
        return decoSavedTheme;
    }

    @BeforeEach
    public void initTest() {
        decoSavedTheme = createEntity(em);
    }

    @Test
    @Transactional
    void createDecoSavedTheme() throws Exception {
        int databaseSizeBeforeCreate = decoSavedThemeRepository.findAll().size();
        // Create the DecoSavedTheme
        restDecoSavedThemeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoSavedTheme))
            )
            .andExpect(status().isCreated());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeCreate + 1);
        DecoSavedTheme testDecoSavedTheme = decoSavedThemeList.get(decoSavedThemeList.size() - 1);
        assertThat(testDecoSavedTheme.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createDecoSavedThemeWithExistingId() throws Exception {
        // Create the DecoSavedTheme with an existing ID
        decoSavedTheme.setId(1L);

        int databaseSizeBeforeCreate = decoSavedThemeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecoSavedThemeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoSavedTheme))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDecoSavedThemes() throws Exception {
        // Initialize the database
        decoSavedThemeRepository.saveAndFlush(decoSavedTheme);

        // Get all the decoSavedThemeList
        restDecoSavedThemeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decoSavedTheme.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getDecoSavedTheme() throws Exception {
        // Initialize the database
        decoSavedThemeRepository.saveAndFlush(decoSavedTheme);

        // Get the decoSavedTheme
        restDecoSavedThemeMockMvc
            .perform(get(ENTITY_API_URL_ID, decoSavedTheme.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decoSavedTheme.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingDecoSavedTheme() throws Exception {
        // Get the decoSavedTheme
        restDecoSavedThemeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecoSavedTheme() throws Exception {
        // Initialize the database
        decoSavedThemeRepository.saveAndFlush(decoSavedTheme);

        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();

        // Update the decoSavedTheme
        DecoSavedTheme updatedDecoSavedTheme = decoSavedThemeRepository.findById(decoSavedTheme.getId()).get();
        // Disconnect from session so that the updates on updatedDecoSavedTheme are not directly saved in db
        em.detach(updatedDecoSavedTheme);
        updatedDecoSavedTheme.name(UPDATED_NAME);

        restDecoSavedThemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecoSavedTheme.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecoSavedTheme))
            )
            .andExpect(status().isOk());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
        DecoSavedTheme testDecoSavedTheme = decoSavedThemeList.get(decoSavedThemeList.size() - 1);
        assertThat(testDecoSavedTheme.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingDecoSavedTheme() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();
        decoSavedTheme.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoSavedThemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decoSavedTheme.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedTheme))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecoSavedTheme() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();
        decoSavedTheme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoSavedThemeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedTheme))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecoSavedTheme() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();
        decoSavedTheme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoSavedThemeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoSavedTheme)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecoSavedThemeWithPatch() throws Exception {
        // Initialize the database
        decoSavedThemeRepository.saveAndFlush(decoSavedTheme);

        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();

        // Update the decoSavedTheme using partial update
        DecoSavedTheme partialUpdatedDecoSavedTheme = new DecoSavedTheme();
        partialUpdatedDecoSavedTheme.setId(decoSavedTheme.getId());

        partialUpdatedDecoSavedTheme.name(UPDATED_NAME);

        restDecoSavedThemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoSavedTheme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoSavedTheme))
            )
            .andExpect(status().isOk());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
        DecoSavedTheme testDecoSavedTheme = decoSavedThemeList.get(decoSavedThemeList.size() - 1);
        assertThat(testDecoSavedTheme.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateDecoSavedThemeWithPatch() throws Exception {
        // Initialize the database
        decoSavedThemeRepository.saveAndFlush(decoSavedTheme);

        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();

        // Update the decoSavedTheme using partial update
        DecoSavedTheme partialUpdatedDecoSavedTheme = new DecoSavedTheme();
        partialUpdatedDecoSavedTheme.setId(decoSavedTheme.getId());

        partialUpdatedDecoSavedTheme.name(UPDATED_NAME);

        restDecoSavedThemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoSavedTheme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoSavedTheme))
            )
            .andExpect(status().isOk());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
        DecoSavedTheme testDecoSavedTheme = decoSavedThemeList.get(decoSavedThemeList.size() - 1);
        assertThat(testDecoSavedTheme.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingDecoSavedTheme() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();
        decoSavedTheme.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoSavedThemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decoSavedTheme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedTheme))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecoSavedTheme() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();
        decoSavedTheme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoSavedThemeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedTheme))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecoSavedTheme() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedThemeRepository.findAll().size();
        decoSavedTheme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoSavedThemeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(decoSavedTheme))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoSavedTheme in the database
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecoSavedTheme() throws Exception {
        // Initialize the database
        decoSavedThemeRepository.saveAndFlush(decoSavedTheme);

        int databaseSizeBeforeDelete = decoSavedThemeRepository.findAll().size();

        // Delete the decoSavedTheme
        restDecoSavedThemeMockMvc
            .perform(delete(ENTITY_API_URL_ID, decoSavedTheme.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DecoSavedTheme> decoSavedThemeList = decoSavedThemeRepository.findAll();
        assertThat(decoSavedThemeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
