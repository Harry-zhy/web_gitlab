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
import team.bham.domain.DecoSavedCompany;
import team.bham.repository.DecoSavedCompanyRepository;

/**
 * Integration tests for the {@link DecoSavedCompanyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DecoSavedCompanyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/deco-saved-companies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecoSavedCompanyRepository decoSavedCompanyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecoSavedCompanyMockMvc;

    private DecoSavedCompany decoSavedCompany;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoSavedCompany createEntity(EntityManager em) {
        DecoSavedCompany decoSavedCompany = new DecoSavedCompany().name(DEFAULT_NAME);
        return decoSavedCompany;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoSavedCompany createUpdatedEntity(EntityManager em) {
        DecoSavedCompany decoSavedCompany = new DecoSavedCompany().name(UPDATED_NAME);
        return decoSavedCompany;
    }

    @BeforeEach
    public void initTest() {
        decoSavedCompany = createEntity(em);
    }

    @Test
    @Transactional
    void createDecoSavedCompany() throws Exception {
        int databaseSizeBeforeCreate = decoSavedCompanyRepository.findAll().size();
        // Create the DecoSavedCompany
        restDecoSavedCompanyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoSavedCompany))
            )
            .andExpect(status().isCreated());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeCreate + 1);
        DecoSavedCompany testDecoSavedCompany = decoSavedCompanyList.get(decoSavedCompanyList.size() - 1);
        assertThat(testDecoSavedCompany.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createDecoSavedCompanyWithExistingId() throws Exception {
        // Create the DecoSavedCompany with an existing ID
        decoSavedCompany.setId(1L);

        int databaseSizeBeforeCreate = decoSavedCompanyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecoSavedCompanyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoSavedCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDecoSavedCompanies() throws Exception {
        // Initialize the database
        decoSavedCompanyRepository.saveAndFlush(decoSavedCompany);

        // Get all the decoSavedCompanyList
        restDecoSavedCompanyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decoSavedCompany.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getDecoSavedCompany() throws Exception {
        // Initialize the database
        decoSavedCompanyRepository.saveAndFlush(decoSavedCompany);

        // Get the decoSavedCompany
        restDecoSavedCompanyMockMvc
            .perform(get(ENTITY_API_URL_ID, decoSavedCompany.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decoSavedCompany.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingDecoSavedCompany() throws Exception {
        // Get the decoSavedCompany
        restDecoSavedCompanyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecoSavedCompany() throws Exception {
        // Initialize the database
        decoSavedCompanyRepository.saveAndFlush(decoSavedCompany);

        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();

        // Update the decoSavedCompany
        DecoSavedCompany updatedDecoSavedCompany = decoSavedCompanyRepository.findById(decoSavedCompany.getId()).get();
        // Disconnect from session so that the updates on updatedDecoSavedCompany are not directly saved in db
        em.detach(updatedDecoSavedCompany);
        updatedDecoSavedCompany.name(UPDATED_NAME);

        restDecoSavedCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecoSavedCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecoSavedCompany))
            )
            .andExpect(status().isOk());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
        DecoSavedCompany testDecoSavedCompany = decoSavedCompanyList.get(decoSavedCompanyList.size() - 1);
        assertThat(testDecoSavedCompany.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingDecoSavedCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();
        decoSavedCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoSavedCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decoSavedCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecoSavedCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();
        decoSavedCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoSavedCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecoSavedCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();
        decoSavedCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoSavedCompanyMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoSavedCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecoSavedCompanyWithPatch() throws Exception {
        // Initialize the database
        decoSavedCompanyRepository.saveAndFlush(decoSavedCompany);

        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();

        // Update the decoSavedCompany using partial update
        DecoSavedCompany partialUpdatedDecoSavedCompany = new DecoSavedCompany();
        partialUpdatedDecoSavedCompany.setId(decoSavedCompany.getId());

        partialUpdatedDecoSavedCompany.name(UPDATED_NAME);

        restDecoSavedCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoSavedCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoSavedCompany))
            )
            .andExpect(status().isOk());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
        DecoSavedCompany testDecoSavedCompany = decoSavedCompanyList.get(decoSavedCompanyList.size() - 1);
        assertThat(testDecoSavedCompany.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateDecoSavedCompanyWithPatch() throws Exception {
        // Initialize the database
        decoSavedCompanyRepository.saveAndFlush(decoSavedCompany);

        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();

        // Update the decoSavedCompany using partial update
        DecoSavedCompany partialUpdatedDecoSavedCompany = new DecoSavedCompany();
        partialUpdatedDecoSavedCompany.setId(decoSavedCompany.getId());

        partialUpdatedDecoSavedCompany.name(UPDATED_NAME);

        restDecoSavedCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoSavedCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoSavedCompany))
            )
            .andExpect(status().isOk());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
        DecoSavedCompany testDecoSavedCompany = decoSavedCompanyList.get(decoSavedCompanyList.size() - 1);
        assertThat(testDecoSavedCompany.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingDecoSavedCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();
        decoSavedCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoSavedCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decoSavedCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecoSavedCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();
        decoSavedCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoSavedCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecoSavedCompany() throws Exception {
        int databaseSizeBeforeUpdate = decoSavedCompanyRepository.findAll().size();
        decoSavedCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoSavedCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoSavedCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoSavedCompany in the database
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecoSavedCompany() throws Exception {
        // Initialize the database
        decoSavedCompanyRepository.saveAndFlush(decoSavedCompany);

        int databaseSizeBeforeDelete = decoSavedCompanyRepository.findAll().size();

        // Delete the decoSavedCompany
        restDecoSavedCompanyMockMvc
            .perform(delete(ENTITY_API_URL_ID, decoSavedCompany.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DecoSavedCompany> decoSavedCompanyList = decoSavedCompanyRepository.findAll();
        assertThat(decoSavedCompanyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
