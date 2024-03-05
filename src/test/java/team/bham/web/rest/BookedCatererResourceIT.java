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
import team.bham.domain.BookedCaterer;
import team.bham.repository.BookedCatererRepository;

/**
 * Integration tests for the {@link BookedCatererResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BookedCatererResourceIT {

    private static final Boolean DEFAULT_CONFIRMATION_STATUS = false;
    private static final Boolean UPDATED_CONFIRMATION_STATUS = true;

    private static final String ENTITY_API_URL = "/api/booked-caterers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BookedCatererRepository bookedCatererRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBookedCatererMockMvc;

    private BookedCaterer bookedCaterer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookedCaterer createEntity(EntityManager em) {
        BookedCaterer bookedCaterer = new BookedCaterer().confirmationStatus(DEFAULT_CONFIRMATION_STATUS);
        return bookedCaterer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BookedCaterer createUpdatedEntity(EntityManager em) {
        BookedCaterer bookedCaterer = new BookedCaterer().confirmationStatus(UPDATED_CONFIRMATION_STATUS);
        return bookedCaterer;
    }

    @BeforeEach
    public void initTest() {
        bookedCaterer = createEntity(em);
    }

    @Test
    @Transactional
    void createBookedCaterer() throws Exception {
        int databaseSizeBeforeCreate = bookedCatererRepository.findAll().size();
        // Create the BookedCaterer
        restBookedCatererMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookedCaterer)))
            .andExpect(status().isCreated());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeCreate + 1);
        BookedCaterer testBookedCaterer = bookedCatererList.get(bookedCatererList.size() - 1);
        assertThat(testBookedCaterer.getConfirmationStatus()).isEqualTo(DEFAULT_CONFIRMATION_STATUS);
    }

    @Test
    @Transactional
    void createBookedCatererWithExistingId() throws Exception {
        // Create the BookedCaterer with an existing ID
        bookedCaterer.setId(1L);

        int databaseSizeBeforeCreate = bookedCatererRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBookedCatererMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookedCaterer)))
            .andExpect(status().isBadRequest());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBookedCaterers() throws Exception {
        // Initialize the database
        bookedCatererRepository.saveAndFlush(bookedCaterer);

        // Get all the bookedCatererList
        restBookedCatererMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bookedCaterer.getId().intValue())))
            .andExpect(jsonPath("$.[*].confirmationStatus").value(hasItem(DEFAULT_CONFIRMATION_STATUS.booleanValue())));
    }

    @Test
    @Transactional
    void getBookedCaterer() throws Exception {
        // Initialize the database
        bookedCatererRepository.saveAndFlush(bookedCaterer);

        // Get the bookedCaterer
        restBookedCatererMockMvc
            .perform(get(ENTITY_API_URL_ID, bookedCaterer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bookedCaterer.getId().intValue()))
            .andExpect(jsonPath("$.confirmationStatus").value(DEFAULT_CONFIRMATION_STATUS.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingBookedCaterer() throws Exception {
        // Get the bookedCaterer
        restBookedCatererMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBookedCaterer() throws Exception {
        // Initialize the database
        bookedCatererRepository.saveAndFlush(bookedCaterer);

        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();

        // Update the bookedCaterer
        BookedCaterer updatedBookedCaterer = bookedCatererRepository.findById(bookedCaterer.getId()).get();
        // Disconnect from session so that the updates on updatedBookedCaterer are not directly saved in db
        em.detach(updatedBookedCaterer);
        updatedBookedCaterer.confirmationStatus(UPDATED_CONFIRMATION_STATUS);

        restBookedCatererMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBookedCaterer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBookedCaterer))
            )
            .andExpect(status().isOk());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
        BookedCaterer testBookedCaterer = bookedCatererList.get(bookedCatererList.size() - 1);
        assertThat(testBookedCaterer.getConfirmationStatus()).isEqualTo(UPDATED_CONFIRMATION_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingBookedCaterer() throws Exception {
        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();
        bookedCaterer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookedCatererMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bookedCaterer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bookedCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBookedCaterer() throws Exception {
        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();
        bookedCaterer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookedCatererMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bookedCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBookedCaterer() throws Exception {
        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();
        bookedCaterer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookedCatererMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bookedCaterer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBookedCatererWithPatch() throws Exception {
        // Initialize the database
        bookedCatererRepository.saveAndFlush(bookedCaterer);

        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();

        // Update the bookedCaterer using partial update
        BookedCaterer partialUpdatedBookedCaterer = new BookedCaterer();
        partialUpdatedBookedCaterer.setId(bookedCaterer.getId());

        restBookedCatererMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookedCaterer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBookedCaterer))
            )
            .andExpect(status().isOk());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
        BookedCaterer testBookedCaterer = bookedCatererList.get(bookedCatererList.size() - 1);
        assertThat(testBookedCaterer.getConfirmationStatus()).isEqualTo(DEFAULT_CONFIRMATION_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateBookedCatererWithPatch() throws Exception {
        // Initialize the database
        bookedCatererRepository.saveAndFlush(bookedCaterer);

        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();

        // Update the bookedCaterer using partial update
        BookedCaterer partialUpdatedBookedCaterer = new BookedCaterer();
        partialUpdatedBookedCaterer.setId(bookedCaterer.getId());

        partialUpdatedBookedCaterer.confirmationStatus(UPDATED_CONFIRMATION_STATUS);

        restBookedCatererMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBookedCaterer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBookedCaterer))
            )
            .andExpect(status().isOk());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
        BookedCaterer testBookedCaterer = bookedCatererList.get(bookedCatererList.size() - 1);
        assertThat(testBookedCaterer.getConfirmationStatus()).isEqualTo(UPDATED_CONFIRMATION_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingBookedCaterer() throws Exception {
        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();
        bookedCaterer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBookedCatererMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bookedCaterer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bookedCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBookedCaterer() throws Exception {
        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();
        bookedCaterer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookedCatererMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bookedCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBookedCaterer() throws Exception {
        int databaseSizeBeforeUpdate = bookedCatererRepository.findAll().size();
        bookedCaterer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBookedCatererMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bookedCaterer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BookedCaterer in the database
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBookedCaterer() throws Exception {
        // Initialize the database
        bookedCatererRepository.saveAndFlush(bookedCaterer);

        int databaseSizeBeforeDelete = bookedCatererRepository.findAll().size();

        // Delete the bookedCaterer
        restBookedCatererMockMvc
            .perform(delete(ENTITY_API_URL_ID, bookedCaterer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BookedCaterer> bookedCatererList = bookedCatererRepository.findAll();
        assertThat(bookedCatererList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
