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
import team.bham.domain.ActivitySelf;
import team.bham.repository.ActivitySelfRepository;

/**
 * Integration tests for the {@link ActivitySelfResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ActivitySelfResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/activity-selves";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActivitySelfRepository activitySelfRepository;

    @Mock
    private ActivitySelfRepository activitySelfRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivitySelfMockMvc;

    private ActivitySelf activitySelf;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivitySelf createEntity(EntityManager em) {
        ActivitySelf activitySelf = new ActivitySelf().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return activitySelf;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivitySelf createUpdatedEntity(EntityManager em) {
        ActivitySelf activitySelf = new ActivitySelf().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return activitySelf;
    }

    @BeforeEach
    public void initTest() {
        activitySelf = createEntity(em);
    }

    @Test
    @Transactional
    void createActivitySelf() throws Exception {
        int databaseSizeBeforeCreate = activitySelfRepository.findAll().size();
        // Create the ActivitySelf
        restActivitySelfMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySelf)))
            .andExpect(status().isCreated());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeCreate + 1);
        ActivitySelf testActivitySelf = activitySelfList.get(activitySelfList.size() - 1);
        assertThat(testActivitySelf.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testActivitySelf.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createActivitySelfWithExistingId() throws Exception {
        // Create the ActivitySelf with an existing ID
        activitySelf.setId(1L);

        int databaseSizeBeforeCreate = activitySelfRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivitySelfMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySelf)))
            .andExpect(status().isBadRequest());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = activitySelfRepository.findAll().size();
        // set the field null
        activitySelf.setName(null);

        // Create the ActivitySelf, which fails.

        restActivitySelfMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySelf)))
            .andExpect(status().isBadRequest());

        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllActivitySelves() throws Exception {
        // Initialize the database
        activitySelfRepository.saveAndFlush(activitySelf);

        // Get all the activitySelfList
        restActivitySelfMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activitySelf.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllActivitySelvesWithEagerRelationshipsIsEnabled() throws Exception {
        when(activitySelfRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restActivitySelfMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(activitySelfRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllActivitySelvesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(activitySelfRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restActivitySelfMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(activitySelfRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getActivitySelf() throws Exception {
        // Initialize the database
        activitySelfRepository.saveAndFlush(activitySelf);

        // Get the activitySelf
        restActivitySelfMockMvc
            .perform(get(ENTITY_API_URL_ID, activitySelf.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activitySelf.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingActivitySelf() throws Exception {
        // Get the activitySelf
        restActivitySelfMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingActivitySelf() throws Exception {
        // Initialize the database
        activitySelfRepository.saveAndFlush(activitySelf);

        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();

        // Update the activitySelf
        ActivitySelf updatedActivitySelf = activitySelfRepository.findById(activitySelf.getId()).get();
        // Disconnect from session so that the updates on updatedActivitySelf are not directly saved in db
        em.detach(updatedActivitySelf);
        updatedActivitySelf.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restActivitySelfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivitySelf.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivitySelf))
            )
            .andExpect(status().isOk());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
        ActivitySelf testActivitySelf = activitySelfList.get(activitySelfList.size() - 1);
        assertThat(testActivitySelf.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivitySelf.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingActivitySelf() throws Exception {
        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();
        activitySelf.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivitySelfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activitySelf.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activitySelf))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivitySelf() throws Exception {
        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();
        activitySelf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitySelfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activitySelf))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivitySelf() throws Exception {
        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();
        activitySelf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitySelfMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activitySelf)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActivitySelfWithPatch() throws Exception {
        // Initialize the database
        activitySelfRepository.saveAndFlush(activitySelf);

        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();

        // Update the activitySelf using partial update
        ActivitySelf partialUpdatedActivitySelf = new ActivitySelf();
        partialUpdatedActivitySelf.setId(activitySelf.getId());

        restActivitySelfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivitySelf.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivitySelf))
            )
            .andExpect(status().isOk());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
        ActivitySelf testActivitySelf = activitySelfList.get(activitySelfList.size() - 1);
        assertThat(testActivitySelf.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testActivitySelf.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateActivitySelfWithPatch() throws Exception {
        // Initialize the database
        activitySelfRepository.saveAndFlush(activitySelf);

        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();

        // Update the activitySelf using partial update
        ActivitySelf partialUpdatedActivitySelf = new ActivitySelf();
        partialUpdatedActivitySelf.setId(activitySelf.getId());

        partialUpdatedActivitySelf.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restActivitySelfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivitySelf.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivitySelf))
            )
            .andExpect(status().isOk());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
        ActivitySelf testActivitySelf = activitySelfList.get(activitySelfList.size() - 1);
        assertThat(testActivitySelf.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testActivitySelf.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingActivitySelf() throws Exception {
        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();
        activitySelf.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivitySelfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activitySelf.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activitySelf))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivitySelf() throws Exception {
        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();
        activitySelf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitySelfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activitySelf))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivitySelf() throws Exception {
        int databaseSizeBeforeUpdate = activitySelfRepository.findAll().size();
        activitySelf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivitySelfMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(activitySelf))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivitySelf in the database
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivitySelf() throws Exception {
        // Initialize the database
        activitySelfRepository.saveAndFlush(activitySelf);

        int databaseSizeBeforeDelete = activitySelfRepository.findAll().size();

        // Delete the activitySelf
        restActivitySelfMockMvc
            .perform(delete(ENTITY_API_URL_ID, activitySelf.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActivitySelf> activitySelfList = activitySelfRepository.findAll();
        assertThat(activitySelfList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
