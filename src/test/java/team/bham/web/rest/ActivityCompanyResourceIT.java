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
import team.bham.domain.ActivityCompany;
import team.bham.repository.ActivityCompanyRepository;

/**
 * Integration tests for the {@link ActivityCompanyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActivityCompanyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ABOUT = "AAAAAAAAAA";
    private static final String UPDATED_ABOUT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/activity-companies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActivityCompanyRepository activityCompanyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivityCompanyMockMvc;

    private ActivityCompany activityCompany;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityCompany createEntity(EntityManager em) {
        ActivityCompany activityCompany = new ActivityCompany().name(DEFAULT_NAME).about(DEFAULT_ABOUT);
        return activityCompany;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityCompany createUpdatedEntity(EntityManager em) {
        ActivityCompany activityCompany = new ActivityCompany().name(UPDATED_NAME).about(UPDATED_ABOUT);
        return activityCompany;
    }

    @BeforeEach
    public void initTest() {
        activityCompany = createEntity(em);
    }

    @Test
    @Transactional
    void createActivityCompany() throws Exception {
        int databaseSizeBeforeCreate = activityCompanyRepository.findAll().size();
        // Create the ActivityCompany
        restActivityCompanyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isCreated());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeCreate + 1);
        ActivityCompany testActivityCompany = activityCompanyList.get(activityCompanyList.size() - 1);
        assertThat(testActivityCompany.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testActivityCompany.getAbout()).isEqualTo(DEFAULT_ABOUT);
    }

    @Test
    @Transactional
    void createActivityCompanyWithExistingId() throws Exception {
        // Create the ActivityCompany with an existing ID
        activityCompany.setId(1L);

        int databaseSizeBeforeCreate = activityCompanyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivityCompanyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = activityCompanyRepository.findAll().size();
        // set the field null
        activityCompany.setName(null);

        // Create the ActivityCompany, which fails.

        restActivityCompanyMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isBadRequest());

        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllActivityCompanies() throws Exception {
        // Initialize the database
        activityCompanyRepository.saveAndFlush(activityCompany);

        // Get all the activityCompanyList
        restActivityCompanyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activityCompany.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].about").value(hasItem(DEFAULT_ABOUT)));
    }

    @Test
    @Transactional
    void getActivityCompany() throws Exception {
        // Initialize the database
        activityCompanyRepository.saveAndFlush(activityCompany);

        // Get the activityCompany
        restActivityCompanyMockMvc
            .perform(get(ENTITY_API_URL_ID, activityCompany.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activityCompany.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.about").value(DEFAULT_ABOUT));
    }

    @Test
    @Transactional
    void getNonExistingActivityCompany() throws Exception {
        // Get the activityCompany
        restActivityCompanyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActivityCompany() throws Exception {
        // Initialize the database
        activityCompanyRepository.saveAndFlush(activityCompany);

        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();

        // Update the activityCompany
        ActivityCompany updatedActivityCompany = activityCompanyRepository.findById(activityCompany.getId()).get();
        // Disconnect from session so that the updates on updatedActivityCompany are not directly saved in db
        em.detach(updatedActivityCompany);
        updatedActivityCompany.name(UPDATED_NAME).about(UPDATED_ABOUT);

        restActivityCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivityCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivityCompany))
            )
            .andExpect(status().isOk());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
        ActivityCompany testActivityCompany = activityCompanyList.get(activityCompanyList.size() - 1);
        assertThat(testActivityCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivityCompany.getAbout()).isEqualTo(UPDATED_ABOUT);
    }

    @Test
    @Transactional
    void putNonExistingActivityCompany() throws Exception {
        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();
        activityCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activityCompany.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivityCompany() throws Exception {
        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();
        activityCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityCompanyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivityCompany() throws Exception {
        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();
        activityCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityCompanyMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActivityCompanyWithPatch() throws Exception {
        // Initialize the database
        activityCompanyRepository.saveAndFlush(activityCompany);

        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();

        // Update the activityCompany using partial update
        ActivityCompany partialUpdatedActivityCompany = new ActivityCompany();
        partialUpdatedActivityCompany.setId(activityCompany.getId());

        partialUpdatedActivityCompany.name(UPDATED_NAME).about(UPDATED_ABOUT);

        restActivityCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityCompany))
            )
            .andExpect(status().isOk());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
        ActivityCompany testActivityCompany = activityCompanyList.get(activityCompanyList.size() - 1);
        assertThat(testActivityCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivityCompany.getAbout()).isEqualTo(UPDATED_ABOUT);
    }

    @Test
    @Transactional
    void fullUpdateActivityCompanyWithPatch() throws Exception {
        // Initialize the database
        activityCompanyRepository.saveAndFlush(activityCompany);

        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();

        // Update the activityCompany using partial update
        ActivityCompany partialUpdatedActivityCompany = new ActivityCompany();
        partialUpdatedActivityCompany.setId(activityCompany.getId());

        partialUpdatedActivityCompany.name(UPDATED_NAME).about(UPDATED_ABOUT);

        restActivityCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityCompany))
            )
            .andExpect(status().isOk());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
        ActivityCompany testActivityCompany = activityCompanyList.get(activityCompanyList.size() - 1);
        assertThat(testActivityCompany.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivityCompany.getAbout()).isEqualTo(UPDATED_ABOUT);
    }

    @Test
    @Transactional
    void patchNonExistingActivityCompany() throws Exception {
        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();
        activityCompany.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activityCompany.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivityCompany() throws Exception {
        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();
        activityCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivityCompany() throws Exception {
        int databaseSizeBeforeUpdate = activityCompanyRepository.findAll().size();
        activityCompany.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityCompanyMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityCompany))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityCompany in the database
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivityCompany() throws Exception {
        // Initialize the database
        activityCompanyRepository.saveAndFlush(activityCompany);

        int databaseSizeBeforeDelete = activityCompanyRepository.findAll().size();

        // Delete the activityCompany
        restActivityCompanyMockMvc
            .perform(delete(ENTITY_API_URL_ID, activityCompany.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActivityCompany> activityCompanyList = activityCompanyRepository.findAll();
        assertThat(activityCompanyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
