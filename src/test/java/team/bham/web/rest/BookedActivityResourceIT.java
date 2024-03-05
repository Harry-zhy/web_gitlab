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
import team.bham.domain.BookedActivity;
import team.bham.repository.BookedActivityRepository;

/**
 * Integration tests for the {@link BookedActivityResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BookedActivityResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/booked-activities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BookedActivityRepository bookedActivityRepository;

    @Mock
    private BookedActivityRepository bookedActivityRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBookedActivityMockMvc;

    private BookedActivity bookedActivity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookedActivity createEntity(EntityManager em) {
        BookedActivity bookedActivity = new BookedActivity().name(DEFAULT_NAME);
        return bookedActivity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookedActivity createUpdatedEntity(EntityManager em) {
        BookedActivity bookedActivity = new BookedActivity().name(UPDATED_NAME);
        return bookedActivity;
    }

    @BeforeEach
    public void initTest() {
        bookedActivity = createEntity(em);
    }

    @Test
    @Transactional
    void createBookedActivity() throws Exception {
        int databaseSizeBeforeCreate = bookedActivityRepository.findAll().size();
        // Create the BookedActivity
        restBookedActivityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookedActivity))
            )
            .andExpect(status().isCreated());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeCreate + 1);
        BookedActivity testBookedActivity = bookedActivityList.get(bookedActivityList.size() - 1);
        assertThat(testBookedActivity.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createBookedActivityWithExistingId() throws Exception {
        // Create the BookedActivity with an existing ID
        bookedActivity.setId(1L);

        int databaseSizeBeforeCreate = bookedActivityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookedActivityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookedActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = bookedActivityRepository.findAll().size();
        // set the field null
        bookedActivity.setName(null);

        // Create the BookedActivity, which fails.

        restBookedActivityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookedActivity))
            )
            .andExpect(status().isBadRequest());

        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBookedActivities() throws Exception {
        // Initialize the database
        bookedActivityRepository.saveAndFlush(bookedActivity);

        // Get all the bookedActivityList
        restBookedActivityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookedActivity.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBookedActivitiesWithEagerRelationshipsIsEnabled() throws Exception {
        when(bookedActivityRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBookedActivityMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(bookedActivityRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBookedActivitiesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(bookedActivityRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBookedActivityMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(bookedActivityRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBookedActivity() throws Exception {
        // Initialize the database
        bookedActivityRepository.saveAndFlush(bookedActivity);

        // Get the bookedActivity
        restBookedActivityMockMvc
            .perform(get(ENTITY_API_URL_ID, bookedActivity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bookedActivity.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingBookedActivity() throws Exception {
        // Get the bookedActivity
        restBookedActivityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBookedActivity() throws Exception {
        // Initialize the database
        bookedActivityRepository.saveAndFlush(bookedActivity);

        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();

        // Update the bookedActivity
        BookedActivity updatedBookedActivity = bookedActivityRepository.findById(bookedActivity.getId()).get();
        // Disconnect from session so that the updates on updatedBookedActivity are not directly saved in db
        em.detach(updatedBookedActivity);
        updatedBookedActivity.name(UPDATED_NAME);

        restBookedActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBookedActivity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBookedActivity))
            )
            .andExpect(status().isOk());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
        BookedActivity testBookedActivity = bookedActivityList.get(bookedActivityList.size() - 1);
        assertThat(testBookedActivity.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingBookedActivity() throws Exception {
        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();
        bookedActivity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookedActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bookedActivity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bookedActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBookedActivity() throws Exception {
        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();
        bookedActivity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookedActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bookedActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBookedActivity() throws Exception {
        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();
        bookedActivity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookedActivityMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookedActivity)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBookedActivityWithPatch() throws Exception {
        // Initialize the database
        bookedActivityRepository.saveAndFlush(bookedActivity);

        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();

        // Update the bookedActivity using partial update
        BookedActivity partialUpdatedBookedActivity = new BookedActivity();
        partialUpdatedBookedActivity.setId(bookedActivity.getId());

        restBookedActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookedActivity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBookedActivity))
            )
            .andExpect(status().isOk());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
        BookedActivity testBookedActivity = bookedActivityList.get(bookedActivityList.size() - 1);
        assertThat(testBookedActivity.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateBookedActivityWithPatch() throws Exception {
        // Initialize the database
        bookedActivityRepository.saveAndFlush(bookedActivity);

        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();

        // Update the bookedActivity using partial update
        BookedActivity partialUpdatedBookedActivity = new BookedActivity();
        partialUpdatedBookedActivity.setId(bookedActivity.getId());

        partialUpdatedBookedActivity.name(UPDATED_NAME);

        restBookedActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookedActivity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBookedActivity))
            )
            .andExpect(status().isOk());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
        BookedActivity testBookedActivity = bookedActivityList.get(bookedActivityList.size() - 1);
        assertThat(testBookedActivity.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingBookedActivity() throws Exception {
        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();
        bookedActivity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookedActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bookedActivity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bookedActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBookedActivity() throws Exception {
        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();
        bookedActivity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookedActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bookedActivity))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBookedActivity() throws Exception {
        int databaseSizeBeforeUpdate = bookedActivityRepository.findAll().size();
        bookedActivity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookedActivityMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bookedActivity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookedActivity in the database
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBookedActivity() throws Exception {
        // Initialize the database
        bookedActivityRepository.saveAndFlush(bookedActivity);

        int databaseSizeBeforeDelete = bookedActivityRepository.findAll().size();

        // Delete the bookedActivity
        restBookedActivityMockMvc
            .perform(delete(ENTITY_API_URL_ID, bookedActivity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BookedActivity> bookedActivityList = bookedActivityRepository.findAll();
        assertThat(bookedActivityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
