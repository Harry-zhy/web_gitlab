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
import team.bham.domain.ActivityIdea;
import team.bham.repository.ActivityIdeaRepository;

/**
 * Integration tests for the {@link ActivityIdeaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActivityIdeaResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_LINK = "AAAAAAAAAA";
    private static final String UPDATED_LINK = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/activity-ideas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActivityIdeaRepository activityIdeaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivityIdeaMockMvc;

    private ActivityIdea activityIdea;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityIdea createEntity(EntityManager em) {
        ActivityIdea activityIdea = new ActivityIdea().description(DEFAULT_DESCRIPTION).link(DEFAULT_LINK);
        return activityIdea;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityIdea createUpdatedEntity(EntityManager em) {
        ActivityIdea activityIdea = new ActivityIdea().description(UPDATED_DESCRIPTION).link(UPDATED_LINK);
        return activityIdea;
    }

    @BeforeEach
    public void initTest() {
        activityIdea = createEntity(em);
    }

    @Test
    @Transactional
    void createActivityIdea() throws Exception {
        int databaseSizeBeforeCreate = activityIdeaRepository.findAll().size();
        // Create the ActivityIdea
        restActivityIdeaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityIdea)))
            .andExpect(status().isCreated());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeCreate + 1);
        ActivityIdea testActivityIdea = activityIdeaList.get(activityIdeaList.size() - 1);
        assertThat(testActivityIdea.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testActivityIdea.getLink()).isEqualTo(DEFAULT_LINK);
    }

    @Test
    @Transactional
    void createActivityIdeaWithExistingId() throws Exception {
        // Create the ActivityIdea with an existing ID
        activityIdea.setId(1L);

        int databaseSizeBeforeCreate = activityIdeaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivityIdeaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityIdea)))
            .andExpect(status().isBadRequest());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = activityIdeaRepository.findAll().size();
        // set the field null
        activityIdea.setDescription(null);

        // Create the ActivityIdea, which fails.

        restActivityIdeaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityIdea)))
            .andExpect(status().isBadRequest());

        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllActivityIdeas() throws Exception {
        // Initialize the database
        activityIdeaRepository.saveAndFlush(activityIdea);

        // Get all the activityIdeaList
        restActivityIdeaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activityIdea.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].link").value(hasItem(DEFAULT_LINK)));
    }

    @Test
    @Transactional
    void getActivityIdea() throws Exception {
        // Initialize the database
        activityIdeaRepository.saveAndFlush(activityIdea);

        // Get the activityIdea
        restActivityIdeaMockMvc
            .perform(get(ENTITY_API_URL_ID, activityIdea.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activityIdea.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.link").value(DEFAULT_LINK));
    }

    @Test
    @Transactional
    void getNonExistingActivityIdea() throws Exception {
        // Get the activityIdea
        restActivityIdeaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActivityIdea() throws Exception {
        // Initialize the database
        activityIdeaRepository.saveAndFlush(activityIdea);

        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();

        // Update the activityIdea
        ActivityIdea updatedActivityIdea = activityIdeaRepository.findById(activityIdea.getId()).get();
        // Disconnect from session so that the updates on updatedActivityIdea are not directly saved in db
        em.detach(updatedActivityIdea);
        updatedActivityIdea.description(UPDATED_DESCRIPTION).link(UPDATED_LINK);

        restActivityIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivityIdea.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivityIdea))
            )
            .andExpect(status().isOk());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
        ActivityIdea testActivityIdea = activityIdeaList.get(activityIdeaList.size() - 1);
        assertThat(testActivityIdea.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testActivityIdea.getLink()).isEqualTo(UPDATED_LINK);
    }

    @Test
    @Transactional
    void putNonExistingActivityIdea() throws Exception {
        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();
        activityIdea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activityIdea.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivityIdea() throws Exception {
        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();
        activityIdea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityIdeaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivityIdea() throws Exception {
        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();
        activityIdea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityIdeaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityIdea)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActivityIdeaWithPatch() throws Exception {
        // Initialize the database
        activityIdeaRepository.saveAndFlush(activityIdea);

        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();

        // Update the activityIdea using partial update
        ActivityIdea partialUpdatedActivityIdea = new ActivityIdea();
        partialUpdatedActivityIdea.setId(activityIdea.getId());

        partialUpdatedActivityIdea.description(UPDATED_DESCRIPTION).link(UPDATED_LINK);

        restActivityIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityIdea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityIdea))
            )
            .andExpect(status().isOk());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
        ActivityIdea testActivityIdea = activityIdeaList.get(activityIdeaList.size() - 1);
        assertThat(testActivityIdea.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testActivityIdea.getLink()).isEqualTo(UPDATED_LINK);
    }

    @Test
    @Transactional
    void fullUpdateActivityIdeaWithPatch() throws Exception {
        // Initialize the database
        activityIdeaRepository.saveAndFlush(activityIdea);

        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();

        // Update the activityIdea using partial update
        ActivityIdea partialUpdatedActivityIdea = new ActivityIdea();
        partialUpdatedActivityIdea.setId(activityIdea.getId());

        partialUpdatedActivityIdea.description(UPDATED_DESCRIPTION).link(UPDATED_LINK);

        restActivityIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityIdea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityIdea))
            )
            .andExpect(status().isOk());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
        ActivityIdea testActivityIdea = activityIdeaList.get(activityIdeaList.size() - 1);
        assertThat(testActivityIdea.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testActivityIdea.getLink()).isEqualTo(UPDATED_LINK);
    }

    @Test
    @Transactional
    void patchNonExistingActivityIdea() throws Exception {
        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();
        activityIdea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activityIdea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivityIdea() throws Exception {
        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();
        activityIdea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityIdea))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivityIdea() throws Exception {
        int databaseSizeBeforeUpdate = activityIdeaRepository.findAll().size();
        activityIdea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityIdeaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(activityIdea))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityIdea in the database
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivityIdea() throws Exception {
        // Initialize the database
        activityIdeaRepository.saveAndFlush(activityIdea);

        int databaseSizeBeforeDelete = activityIdeaRepository.findAll().size();

        // Delete the activityIdea
        restActivityIdeaMockMvc
            .perform(delete(ENTITY_API_URL_ID, activityIdea.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActivityIdea> activityIdeaList = activityIdeaRepository.findAll();
        assertThat(activityIdeaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
