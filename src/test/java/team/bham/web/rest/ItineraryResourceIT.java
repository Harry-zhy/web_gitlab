package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static team.bham.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
import team.bham.domain.Itinerary;
import team.bham.repository.ItineraryRepository;

/**
 * Integration tests for the {@link ItineraryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItineraryResourceIT {

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/itineraries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItineraryRepository itineraryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItineraryMockMvc;

    private Itinerary itinerary;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Itinerary createEntity(EntityManager em) {
        Itinerary itinerary = new Itinerary().startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME).location(DEFAULT_LOCATION);
        return itinerary;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Itinerary createUpdatedEntity(EntityManager em) {
        Itinerary itinerary = new Itinerary().startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).location(UPDATED_LOCATION);
        return itinerary;
    }

    @BeforeEach
    public void initTest() {
        itinerary = createEntity(em);
    }

    @Test
    @Transactional
    void createItinerary() throws Exception {
        int databaseSizeBeforeCreate = itineraryRepository.findAll().size();
        // Create the Itinerary
        restItineraryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itinerary)))
            .andExpect(status().isCreated());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeCreate + 1);
        Itinerary testItinerary = itineraryList.get(itineraryList.size() - 1);
        assertThat(testItinerary.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testItinerary.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testItinerary.getLocation()).isEqualTo(DEFAULT_LOCATION);
    }

    @Test
    @Transactional
    void createItineraryWithExistingId() throws Exception {
        // Create the Itinerary with an existing ID
        itinerary.setId(1L);

        int databaseSizeBeforeCreate = itineraryRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItineraryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itinerary)))
            .andExpect(status().isBadRequest());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItineraries() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);

        // Get all the itineraryList
        restItineraryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itinerary.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(sameInstant(DEFAULT_END_TIME))))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)));
    }

    @Test
    @Transactional
    void getItinerary() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);

        // Get the itinerary
        restItineraryMockMvc
            .perform(get(ENTITY_API_URL_ID, itinerary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itinerary.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(sameInstant(DEFAULT_END_TIME)))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION));
    }

    @Test
    @Transactional
    void getNonExistingItinerary() throws Exception {
        // Get the itinerary
        restItineraryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItinerary() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);

        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();

        // Update the itinerary
        Itinerary updatedItinerary = itineraryRepository.findById(itinerary.getId()).get();
        // Disconnect from session so that the updates on updatedItinerary are not directly saved in db
        em.detach(updatedItinerary);
        updatedItinerary.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).location(UPDATED_LOCATION);

        restItineraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItinerary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItinerary))
            )
            .andExpect(status().isOk());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
        Itinerary testItinerary = itineraryList.get(itineraryList.size() - 1);
        assertThat(testItinerary.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testItinerary.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testItinerary.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void putNonExistingItinerary() throws Exception {
        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();
        itinerary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itinerary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItinerary() throws Exception {
        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();
        itinerary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItinerary() throws Exception {
        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();
        itinerary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itinerary)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItineraryWithPatch() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);

        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();

        // Update the itinerary using partial update
        Itinerary partialUpdatedItinerary = new Itinerary();
        partialUpdatedItinerary.setId(itinerary.getId());

        partialUpdatedItinerary.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).location(UPDATED_LOCATION);

        restItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItinerary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItinerary))
            )
            .andExpect(status().isOk());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
        Itinerary testItinerary = itineraryList.get(itineraryList.size() - 1);
        assertThat(testItinerary.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testItinerary.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testItinerary.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void fullUpdateItineraryWithPatch() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);

        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();

        // Update the itinerary using partial update
        Itinerary partialUpdatedItinerary = new Itinerary();
        partialUpdatedItinerary.setId(itinerary.getId());

        partialUpdatedItinerary.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME).location(UPDATED_LOCATION);

        restItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItinerary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItinerary))
            )
            .andExpect(status().isOk());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
        Itinerary testItinerary = itineraryList.get(itineraryList.size() - 1);
        assertThat(testItinerary.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testItinerary.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testItinerary.getLocation()).isEqualTo(UPDATED_LOCATION);
    }

    @Test
    @Transactional
    void patchNonExistingItinerary() throws Exception {
        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();
        itinerary.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itinerary.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItinerary() throws Exception {
        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();
        itinerary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itinerary))
            )
            .andExpect(status().isBadRequest());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItinerary() throws Exception {
        int databaseSizeBeforeUpdate = itineraryRepository.findAll().size();
        itinerary.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itinerary))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Itinerary in the database
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItinerary() throws Exception {
        // Initialize the database
        itineraryRepository.saveAndFlush(itinerary);

        int databaseSizeBeforeDelete = itineraryRepository.findAll().size();

        // Delete the itinerary
        restItineraryMockMvc
            .perform(delete(ENTITY_API_URL_ID, itinerary.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Itinerary> itineraryList = itineraryRepository.findAll();
        assertThat(itineraryList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
