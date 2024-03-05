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
import team.bham.domain.DecoCompany;
import team.bham.repository.DecoCompanyRepository;

/**
 * Integration tests for the {@link DecoCompanyResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DecoCompanyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ABOUT = "AAAAAAAAAA";
    private static final String UPDATED_ABOUT = "BBBBBBBBBB";

    private static final Integer DEFAULT_RATING = 1;
    private static final Integer UPDATED_RATING = 2;

    private static final String ENTITY_API_URL = "/api/deco-companies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecoCompanyRepository decoCompanyRepository;

    @Mock
    private DecoCompanyRepository decoCompanyRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecoCompanyMockMvc;

    private DecoCompany decoCompany;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoCompany createEntity(EntityManager em) {
        DecoCompany decoCompany = new DecoCompany().name(DEFAULT_NAME).about(DEFAULT_ABOUT).rating(DEFAULT_RATING);
        return decoCompany;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoCompany createUpdatedEntity(EntityManager em) {
        DecoCompany decoCompany = new DecoCompany().name(UPDATED_NAME).about(UPDATED_ABOUT).rating(UPDATED_RATING);
        return decoCompany;
    }

    @BeforeEach
    public void initTest() {
        decoCompany = createEntity(em);
    }

    @Test
    @Transactional
    void createDecoCompany() throws Exception {
        int databaseSizeBeforeCreate = decoCompanyRepository.findAll().size();
        // Create the DecoCompany
        restDecoCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoCompany)))
            .andExpect(status().isCreated());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeCreate + 1);
        DecoCompany testDecoCompany = decoCompanyList.get(decoCompanyList.size() - 1);
        assertThat(testDecoCompany.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDecoCompany.getAbout()).isEqualTo(DEFAULT_ABOUT);
        assertThat(testDecoCompany.getRating()).isEqualTo(DEFAULT_RATING);
    }

    @Test
    @Transactional
    void createDecoCompanyWithExistingId() throws Exception {
        // Create the DecoCompany with an existing ID
        decoCompany.setId(1L);

        int databaseSizeBeforeCreate = decoCompanyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecoCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoCompany)))
            .andExpect(status().isBadRequest());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = decoCompanyRepository.findAll().size();
        // set the field null
        decoCompany.setName(null);

        // Create the DecoCompany, which fails.

        restDecoCompanyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoCompany)))
            .andExpect(status().isBadRequest());

        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDecoCompanies() throws Exception {
        // Initialize the database
        decoCompanyRepository.saveAndFlush(decoCompany);

        // Get all the decoCompanyList
        restDecoCompanyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decoCompany.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].about").value(hasItem(DEFAULT_ABOUT)))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDecoCompaniesWithEagerRelationshipsIsEnabled() throws Exception {
        when(decoCompanyRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDecoCompanyMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(decoCompanyRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDecoCompaniesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(decoCompanyRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDecoCompanyMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(decoCompanyRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDecoCompany() throws Exception {
        // Initialize the database
        decoCompanyRepository.saveAndFlush(decoCompany);

        // Get the decoCompany
        restDecoCompanyMockMvc
            .perform(get(ENTITY_API_URL_ID, decoCompany.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decoCompany.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.about").value(DEFAULT_ABOUT))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING));
    }

    @Test
    @Transactional
    void getNonExistingDecoCompany() throws Exception {
        // Get the decoCompany
        restDecoCompanyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecoCompany() throws Exception {
        // Initialize the database
        decoCompanyRepository.saveAndFlush(decoCompany);

        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();

        // Update the decoCompany
        DecoCompany updatedDecoCompany = decoCompanyRepository.findById(decoCompany.getId()).get();
        // Disconnect from session so that the updates on updatedDecoCompany are not directly saved in db
        em.detach(updatedDecoCompany);
        updatedDecoCompany.name(UPDATED_NAME).about(UPDATED_ABOUT).rating(UPDATED_RATING);

        restDecoCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecoCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecoCompany))
            )
            .andExpect(status().isOk());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
        DecoCompany testDecoCompany = decoCompanyList.get(decoCompanyList.size() - 1);
        assertThat(testDecoCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDecoCompany.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testDecoCompany.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void putNonExistingDecoCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();
        decoCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decoCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecoCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();
        decoCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecoCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();
        decoCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoCompanyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoCompany)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecoCompanyWithPatch() throws Exception {
        // Initialize the database
        decoCompanyRepository.saveAndFlush(decoCompany);

        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();

        // Update the decoCompany using partial update
        DecoCompany partialUpdatedDecoCompany = new DecoCompany();
        partialUpdatedDecoCompany.setId(decoCompany.getId());

        partialUpdatedDecoCompany.name(UPDATED_NAME).about(UPDATED_ABOUT).rating(UPDATED_RATING);

        restDecoCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoCompany))
            )
            .andExpect(status().isOk());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
        DecoCompany testDecoCompany = decoCompanyList.get(decoCompanyList.size() - 1);
        assertThat(testDecoCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDecoCompany.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testDecoCompany.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void fullUpdateDecoCompanyWithPatch() throws Exception {
        // Initialize the database
        decoCompanyRepository.saveAndFlush(decoCompany);

        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();

        // Update the decoCompany using partial update
        DecoCompany partialUpdatedDecoCompany = new DecoCompany();
        partialUpdatedDecoCompany.setId(decoCompany.getId());

        partialUpdatedDecoCompany.name(UPDATED_NAME).about(UPDATED_ABOUT).rating(UPDATED_RATING);

        restDecoCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoCompany))
            )
            .andExpect(status().isOk());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
        DecoCompany testDecoCompany = decoCompanyList.get(decoCompanyList.size() - 1);
        assertThat(testDecoCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDecoCompany.getAbout()).isEqualTo(UPDATED_ABOUT);
        assertThat(testDecoCompany.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void patchNonExistingDecoCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();
        decoCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decoCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecoCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();
        decoCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecoCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoCompanyRepository.findAll().size();
        decoCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(decoCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoCompany in the database
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecoCompany() throws Exception {
        // Initialize the database
        decoCompanyRepository.saveAndFlush(decoCompany);

        int databaseSizeBeforeDelete = decoCompanyRepository.findAll().size();

        // Delete the decoCompany
        restDecoCompanyMockMvc
            .perform(delete(ENTITY_API_URL_ID, decoCompany.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DecoCompany> decoCompanyList = decoCompanyRepository.findAll();
        assertThat(decoCompanyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
