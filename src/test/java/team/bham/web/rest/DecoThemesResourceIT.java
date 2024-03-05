package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.DecoThemes;
import team.bham.repository.DecoThemesRepository;

/**
 * Integration tests for the {@link DecoThemesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DecoThemesResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/deco-themes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecoThemesRepository decoThemesRepository;

    @Mock
    private DecoThemesRepository decoThemesRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecoThemesMockMvc;

    private DecoThemes decoThemes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoThemes createEntity(EntityManager em) {
        DecoThemes decoThemes = new DecoThemes().description(DEFAULT_DESCRIPTION).name(DEFAULT_NAME);
        return decoThemes;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoThemes createUpdatedEntity(EntityManager em) {
        DecoThemes decoThemes = new DecoThemes().description(UPDATED_DESCRIPTION).name(UPDATED_NAME);
        return decoThemes;
    }

    @BeforeEach
    public void initTest() {
        decoThemes = createEntity(em);
    }

    @Test
    @Transactional
    void createDecoThemes() throws Exception {
        int databaseSizeBeforeCreate = decoThemesRepository.findAll().size();
        // Create the DecoThemes
        restDecoThemesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoThemes)))
            .andExpect(status().isCreated());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeCreate + 1);
        DecoThemes testDecoThemes = decoThemesList.get(decoThemesList.size() - 1);
        assertThat(testDecoThemes.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDecoThemes.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createDecoThemesWithExistingId() throws Exception {
        // Create the DecoThemes with an existing ID
        decoThemes.setId(1L);

        int databaseSizeBeforeCreate = decoThemesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecoThemesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoThemes)))
            .andExpect(status().isBadRequest());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDecoThemes() throws Exception {
        // Initialize the database
        decoThemesRepository.saveAndFlush(decoThemes);

        // Get all the decoThemesList
        restDecoThemesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decoThemes.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDecoThemesWithEagerRelationshipsIsEnabled() throws Exception {
        when(decoThemesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDecoThemesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(decoThemesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDecoThemesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(decoThemesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDecoThemesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(decoThemesRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDecoThemes() throws Exception {
        // Initialize the database
        decoThemesRepository.saveAndFlush(decoThemes);

        // Get the decoThemes
        restDecoThemesMockMvc
            .perform(get(ENTITY_API_URL_ID, decoThemes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decoThemes.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingDecoThemes() throws Exception {
        // Get the decoThemes
        restDecoThemesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecoThemes() throws Exception {
        // Initialize the database
        decoThemesRepository.saveAndFlush(decoThemes);

        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();

        // Update the decoThemes
        DecoThemes updatedDecoThemes = decoThemesRepository.findById(decoThemes.getId()).get();
        // Disconnect from session so that the updates on updatedDecoThemes are not directly saved in db
        em.detach(updatedDecoThemes);
        updatedDecoThemes.description(UPDATED_DESCRIPTION).name(UPDATED_NAME);

        restDecoThemesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecoThemes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecoThemes))
            )
            .andExpect(status().isOk());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
        DecoThemes testDecoThemes = decoThemesList.get(decoThemesList.size() - 1);
        assertThat(testDecoThemes.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDecoThemes.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingDecoThemes() throws Exception {
        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();
        decoThemes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoThemesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decoThemes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoThemes))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecoThemes() throws Exception {
        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();
        decoThemes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoThemesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoThemes))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecoThemes() throws Exception {
        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();
        decoThemes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoThemesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoThemes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecoThemesWithPatch() throws Exception {
        // Initialize the database
        decoThemesRepository.saveAndFlush(decoThemes);

        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();

        // Update the decoThemes using partial update
        DecoThemes partialUpdatedDecoThemes = new DecoThemes();
        partialUpdatedDecoThemes.setId(decoThemes.getId());

        partialUpdatedDecoThemes.description(UPDATED_DESCRIPTION).name(UPDATED_NAME);

        restDecoThemesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoThemes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoThemes))
            )
            .andExpect(status().isOk());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
        DecoThemes testDecoThemes = decoThemesList.get(decoThemesList.size() - 1);
        assertThat(testDecoThemes.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDecoThemes.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateDecoThemesWithPatch() throws Exception {
        // Initialize the database
        decoThemesRepository.saveAndFlush(decoThemes);

        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();

        // Update the decoThemes using partial update
        DecoThemes partialUpdatedDecoThemes = new DecoThemes();
        partialUpdatedDecoThemes.setId(decoThemes.getId());

        partialUpdatedDecoThemes.description(UPDATED_DESCRIPTION).name(UPDATED_NAME);

        restDecoThemesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoThemes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoThemes))
            )
            .andExpect(status().isOk());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
        DecoThemes testDecoThemes = decoThemesList.get(decoThemesList.size() - 1);
        assertThat(testDecoThemes.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDecoThemes.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingDecoThemes() throws Exception {
        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();
        decoThemes.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoThemesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decoThemes.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoThemes))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecoThemes() throws Exception {
        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();
        decoThemes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoThemesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoThemes))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecoThemes() throws Exception {
        int databaseSizeBeforeUpdate = decoThemesRepository.findAll().size();
        decoThemes.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoThemesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(decoThemes))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoThemes in the database
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecoThemes() throws Exception {
        // Initialize the database
        decoThemesRepository.saveAndFlush(decoThemes);

        int databaseSizeBeforeDelete = decoThemesRepository.findAll().size();

        // Delete the decoThemes
        restDecoThemesMockMvc
            .perform(delete(ENTITY_API_URL_ID, decoThemes.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DecoThemes> decoThemesList = decoThemesRepository.findAll();
        assertThat(decoThemesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
