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
import team.bham.domain.EventItinerary;
import team.bham.repository.EventItineraryRepository;

/**
 * Integration tests for the {@link EventItineraryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventItineraryResourceIT {

    private static final Integer DEFAULT_NUMBER_OF_GUESTS = 1;
    private static final Integer UPDATED_NUMBER_OF_GUESTS = 2;

    private static final String ENTITY_API_URL = "/api/event-itineraries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventItineraryRepository eventItineraryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventItineraryMockMvc;

    private EventItinerary eventItinerary;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventItinerary createEntity(EntityManager em) {
        EventItinerary eventItinerary = new EventItinerary().numberOfGuests(DEFAULT_NUMBER_OF_GUESTS);
        return eventItinerary;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventItinerary createUpdatedEntity(EntityManager em) {
        EventItinerary eventItinerary = new EventItinerary().numberOfGuests(UPDATED_NUMBER_OF_GUESTS);
        return eventItinerary;
    }

    @BeforeEach
    public void initTest() {
        eventItinerary = createEntity(em);
    }

    @Test
    @Transactional
    void createEventItinerary() throws Exception {
        int databaseSizeBeforeCreate = eventItineraryRepository.findAll().size();
        // Create the EventItinerary
        restEventItineraryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventItinerary))
            )
            .andExpect(status().isCreated());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeCreate + 1);
        EventItinerary testEventItinerary = eventItineraryList.get(eventItineraryList.size() - 1);
        assertThat(testEventItinerary.getNumberOfGuests()).isEqualTo(DEFAULT_NUMBER_OF_GUESTS);
    }

    @Test
    @Transactional
    void createEventItineraryWithExistingId() throws Exception {
        // Create the EventItinerary with an existing ID
        eventItinerary.setId(1L);

        int databaseSizeBeforeCreate = eventItineraryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventItineraryMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventItinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventItineraries() throws Exception {
        // Initialize the database
        eventItineraryRepository.saveAndFlush(eventItinerary);

        // Get all the eventItineraryList
        restEventItineraryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventItinerary.getId().intValue())))
            .andExpect(jsonPath("$.[*].numberOfGuests").value(hasItem(DEFAULT_NUMBER_OF_GUESTS)));
    }

    @Test
    @Transactional
    void getEventItinerary() throws Exception {
        // Initialize the database
        eventItineraryRepository.saveAndFlush(eventItinerary);

        // Get the eventItinerary
        restEventItineraryMockMvc
            .perform(get(ENTITY_API_URL_ID, eventItinerary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eventItinerary.getId().intValue()))
            .andExpect(jsonPath("$.numberOfGuests").value(DEFAULT_NUMBER_OF_GUESTS));
    }

    @Test
    @Transactional
    void getNonExistingEventItinerary() throws Exception {
        // Get the eventItinerary
        restEventItineraryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEventItinerary() throws Exception {
        // Initialize the database
        eventItineraryRepository.saveAndFlush(eventItinerary);

        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();

        // Update the eventItinerary
        EventItinerary updatedEventItinerary = eventItineraryRepository.findById(eventItinerary.getId()).get();
        // Disconnect from session so that the updates on updatedEventItinerary are not directly saved in db
        em.detach(updatedEventItinerary);
        updatedEventItinerary.numberOfGuests(UPDATED_NUMBER_OF_GUESTS);

        restEventItineraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEventItinerary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEventItinerary))
            )
            .andExpect(status().isOk());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
        EventItinerary testEventItinerary = eventItineraryList.get(eventItineraryList.size() - 1);
        assertThat(testEventItinerary.getNumberOfGuests()).isEqualTo(UPDATED_NUMBER_OF_GUESTS);
    }

    @Test
    @Transactional
    void putNonExistingEventItinerary() throws Exception {
        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();
        eventItinerary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventItineraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eventItinerary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventItinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEventItinerary() throws Exception {
        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();
        eventItinerary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventItineraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eventItinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEventItinerary() throws Exception {
        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();
        eventItinerary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventItineraryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eventItinerary)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventItineraryWithPatch() throws Exception {
        // Initialize the database
        eventItineraryRepository.saveAndFlush(eventItinerary);

        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();

        // Update the eventItinerary using partial update
        EventItinerary partialUpdatedEventItinerary = new EventItinerary();
        partialUpdatedEventItinerary.setId(eventItinerary.getId());

        restEventItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventItinerary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventItinerary))
            )
            .andExpect(status().isOk());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
        EventItinerary testEventItinerary = eventItineraryList.get(eventItineraryList.size() - 1);
        assertThat(testEventItinerary.getNumberOfGuests()).isEqualTo(DEFAULT_NUMBER_OF_GUESTS);
    }

    @Test
    @Transactional
    void fullUpdateEventItineraryWithPatch() throws Exception {
        // Initialize the database
        eventItineraryRepository.saveAndFlush(eventItinerary);

        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();

        // Update the eventItinerary using partial update
        EventItinerary partialUpdatedEventItinerary = new EventItinerary();
        partialUpdatedEventItinerary.setId(eventItinerary.getId());

        partialUpdatedEventItinerary.numberOfGuests(UPDATED_NUMBER_OF_GUESTS);

        restEventItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEventItinerary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEventItinerary))
            )
            .andExpect(status().isOk());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
        EventItinerary testEventItinerary = eventItineraryList.get(eventItineraryList.size() - 1);
        assertThat(testEventItinerary.getNumberOfGuests()).isEqualTo(UPDATED_NUMBER_OF_GUESTS);
    }

    @Test
    @Transactional
    void patchNonExistingEventItinerary() throws Exception {
        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();
        eventItinerary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eventItinerary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventItinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEventItinerary() throws Exception {
        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();
        eventItinerary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eventItinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEventItinerary() throws Exception {
        int databaseSizeBeforeUpdate = eventItineraryRepository.findAll().size();
        eventItinerary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(eventItinerary))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EventItinerary in the database
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEventItinerary() throws Exception {
        // Initialize the database
        eventItineraryRepository.saveAndFlush(eventItinerary);

        int databaseSizeBeforeDelete = eventItineraryRepository.findAll().size();

        // Delete the eventItinerary
        restEventItineraryMockMvc
            .perform(delete(ENTITY_API_URL_ID, eventItinerary.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EventItinerary> eventItineraryList = eventItineraryRepository.findAll();
        assertThat(eventItineraryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
