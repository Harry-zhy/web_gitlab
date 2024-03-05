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
import team.bham.domain.BusinessInformation;
import team.bham.repository.BusinessInformationRepository;

/**
 * Integration tests for the {@link BusinessInformationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BusinessInformationResourceIT {

    private static final String DEFAULT_INFORMATION = "AAAAAAAAAA";
    private static final String UPDATED_INFORMATION = "BBBBBBBBBB";

    private static final String DEFAULT_BUSINESS_HOURS = "AAAAAAAAAA";
    private static final String UPDATED_BUSINESS_HOURS = "BBBBBBBBBB";

    private static final String DEFAULT_SPECIAL_SERVICES_AVAILABLE = "AAAAAAAAAA";
    private static final String UPDATED_SPECIAL_SERVICES_AVAILABLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/business-informations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BusinessInformationRepository businessInformationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBusinessInformationMockMvc;

    private BusinessInformation businessInformation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessInformation createEntity(EntityManager em) {
        BusinessInformation businessInformation = new BusinessInformation()
            .information(DEFAULT_INFORMATION)
            .businessHours(DEFAULT_BUSINESS_HOURS)
            .specialServicesAvailable(DEFAULT_SPECIAL_SERVICES_AVAILABLE);
        return businessInformation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessInformation createUpdatedEntity(EntityManager em) {
        BusinessInformation businessInformation = new BusinessInformation()
            .information(UPDATED_INFORMATION)
            .businessHours(UPDATED_BUSINESS_HOURS)
            .specialServicesAvailable(UPDATED_SPECIAL_SERVICES_AVAILABLE);
        return businessInformation;
    }

    @BeforeEach
    public void initTest() {
        businessInformation = createEntity(em);
    }

    @Test
    @Transactional
    void createBusinessInformation() throws Exception {
        int databaseSizeBeforeCreate = businessInformationRepository.findAll().size();
        // Create the BusinessInformation
        restBusinessInformationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessInformation))
            )
            .andExpect(status().isCreated());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeCreate + 1);
        BusinessInformation testBusinessInformation = businessInformationList.get(businessInformationList.size() - 1);
        assertThat(testBusinessInformation.getInformation()).isEqualTo(DEFAULT_INFORMATION);
        assertThat(testBusinessInformation.getBusinessHours()).isEqualTo(DEFAULT_BUSINESS_HOURS);
        assertThat(testBusinessInformation.getSpecialServicesAvailable()).isEqualTo(DEFAULT_SPECIAL_SERVICES_AVAILABLE);
    }

    @Test
    @Transactional
    void createBusinessInformationWithExistingId() throws Exception {
        // Create the BusinessInformation with an existing ID
        businessInformation.setId(1L);

        int databaseSizeBeforeCreate = businessInformationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBusinessInformationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBusinessInformations() throws Exception {
        // Initialize the database
        businessInformationRepository.saveAndFlush(businessInformation);

        // Get all the businessInformationList
        restBusinessInformationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(businessInformation.getId().intValue())))
            .andExpect(jsonPath("$.[*].information").value(hasItem(DEFAULT_INFORMATION)))
            .andExpect(jsonPath("$.[*].businessHours").value(hasItem(DEFAULT_BUSINESS_HOURS)))
            .andExpect(jsonPath("$.[*].specialServicesAvailable").value(hasItem(DEFAULT_SPECIAL_SERVICES_AVAILABLE)));
    }

    @Test
    @Transactional
    void getBusinessInformation() throws Exception {
        // Initialize the database
        businessInformationRepository.saveAndFlush(businessInformation);

        // Get the businessInformation
        restBusinessInformationMockMvc
            .perform(get(ENTITY_API_URL_ID, businessInformation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(businessInformation.getId().intValue()))
            .andExpect(jsonPath("$.information").value(DEFAULT_INFORMATION))
            .andExpect(jsonPath("$.businessHours").value(DEFAULT_BUSINESS_HOURS))
            .andExpect(jsonPath("$.specialServicesAvailable").value(DEFAULT_SPECIAL_SERVICES_AVAILABLE));
    }

    @Test
    @Transactional
    void getNonExistingBusinessInformation() throws Exception {
        // Get the businessInformation
        restBusinessInformationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBusinessInformation() throws Exception {
        // Initialize the database
        businessInformationRepository.saveAndFlush(businessInformation);

        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();

        // Update the businessInformation
        BusinessInformation updatedBusinessInformation = businessInformationRepository.findById(businessInformation.getId()).get();
        // Disconnect from session so that the updates on updatedBusinessInformation are not directly saved in db
        em.detach(updatedBusinessInformation);
        updatedBusinessInformation
            .information(UPDATED_INFORMATION)
            .businessHours(UPDATED_BUSINESS_HOURS)
            .specialServicesAvailable(UPDATED_SPECIAL_SERVICES_AVAILABLE);

        restBusinessInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBusinessInformation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBusinessInformation))
            )
            .andExpect(status().isOk());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
        BusinessInformation testBusinessInformation = businessInformationList.get(businessInformationList.size() - 1);
        assertThat(testBusinessInformation.getInformation()).isEqualTo(UPDATED_INFORMATION);
        assertThat(testBusinessInformation.getBusinessHours()).isEqualTo(UPDATED_BUSINESS_HOURS);
        assertThat(testBusinessInformation.getSpecialServicesAvailable()).isEqualTo(UPDATED_SPECIAL_SERVICES_AVAILABLE);
    }

    @Test
    @Transactional
    void putNonExistingBusinessInformation() throws Exception {
        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();
        businessInformation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, businessInformation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(businessInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBusinessInformation() throws Exception {
        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();
        businessInformation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(businessInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBusinessInformation() throws Exception {
        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();
        businessInformation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessInformationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessInformation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBusinessInformationWithPatch() throws Exception {
        // Initialize the database
        businessInformationRepository.saveAndFlush(businessInformation);

        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();

        // Update the businessInformation using partial update
        BusinessInformation partialUpdatedBusinessInformation = new BusinessInformation();
        partialUpdatedBusinessInformation.setId(businessInformation.getId());

        restBusinessInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusinessInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessInformation))
            )
            .andExpect(status().isOk());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
        BusinessInformation testBusinessInformation = businessInformationList.get(businessInformationList.size() - 1);
        assertThat(testBusinessInformation.getInformation()).isEqualTo(DEFAULT_INFORMATION);
        assertThat(testBusinessInformation.getBusinessHours()).isEqualTo(DEFAULT_BUSINESS_HOURS);
        assertThat(testBusinessInformation.getSpecialServicesAvailable()).isEqualTo(DEFAULT_SPECIAL_SERVICES_AVAILABLE);
    }

    @Test
    @Transactional
    void fullUpdateBusinessInformationWithPatch() throws Exception {
        // Initialize the database
        businessInformationRepository.saveAndFlush(businessInformation);

        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();

        // Update the businessInformation using partial update
        BusinessInformation partialUpdatedBusinessInformation = new BusinessInformation();
        partialUpdatedBusinessInformation.setId(businessInformation.getId());

        partialUpdatedBusinessInformation
            .information(UPDATED_INFORMATION)
            .businessHours(UPDATED_BUSINESS_HOURS)
            .specialServicesAvailable(UPDATED_SPECIAL_SERVICES_AVAILABLE);

        restBusinessInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusinessInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessInformation))
            )
            .andExpect(status().isOk());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
        BusinessInformation testBusinessInformation = businessInformationList.get(businessInformationList.size() - 1);
        assertThat(testBusinessInformation.getInformation()).isEqualTo(UPDATED_INFORMATION);
        assertThat(testBusinessInformation.getBusinessHours()).isEqualTo(UPDATED_BUSINESS_HOURS);
        assertThat(testBusinessInformation.getSpecialServicesAvailable()).isEqualTo(UPDATED_SPECIAL_SERVICES_AVAILABLE);
    }

    @Test
    @Transactional
    void patchNonExistingBusinessInformation() throws Exception {
        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();
        businessInformation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, businessInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBusinessInformation() throws Exception {
        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();
        businessInformation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBusinessInformation() throws Exception {
        int databaseSizeBeforeUpdate = businessInformationRepository.findAll().size();
        businessInformation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessInformationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessInformation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BusinessInformation in the database
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBusinessInformation() throws Exception {
        // Initialize the database
        businessInformationRepository.saveAndFlush(businessInformation);

        int databaseSizeBeforeDelete = businessInformationRepository.findAll().size();

        // Delete the businessInformation
        restBusinessInformationMockMvc
            .perform(delete(ENTITY_API_URL_ID, businessInformation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BusinessInformation> businessInformationList = businessInformationRepository.findAll();
        assertThat(businessInformationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
