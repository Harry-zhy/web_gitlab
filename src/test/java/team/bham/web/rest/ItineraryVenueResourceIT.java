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
import team.bham.domain.ItineraryVenue;
import team.bham.repository.ItineraryVenueRepository;

/**
 * Integration tests for the {@link ItineraryVenueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItineraryVenueResourceIT {

    private static final String DEFAULT_VENUE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_VENUE_NAME = "BBBBBBBBBB";

    private static final Float DEFAULT_VENUE_COST = 1F;
    private static final Float UPDATED_VENUE_COST = 2F;

    private static final String DEFAULT_VENUE_HOST = "AAAAAAAAAA";
    private static final String UPDATED_VENUE_HOST = "BBBBBBBBBB";

    private static final String DEFAULT_VENUE_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_VENUE_ADDRESS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/itinerary-venues";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItineraryVenueRepository itineraryVenueRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItineraryVenueMockMvc;

    private ItineraryVenue itineraryVenue;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryVenue createEntity(EntityManager em) {
        ItineraryVenue itineraryVenue = new ItineraryVenue()
            .venueName(DEFAULT_VENUE_NAME)
            .venueCost(DEFAULT_VENUE_COST)
            .venueHost(DEFAULT_VENUE_HOST)
            .venueAddress(DEFAULT_VENUE_ADDRESS);
        return itineraryVenue;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryVenue createUpdatedEntity(EntityManager em) {
        ItineraryVenue itineraryVenue = new ItineraryVenue()
            .venueName(UPDATED_VENUE_NAME)
            .venueCost(UPDATED_VENUE_COST)
            .venueHost(UPDATED_VENUE_HOST)
            .venueAddress(UPDATED_VENUE_ADDRESS);
        return itineraryVenue;
    }

    @BeforeEach
    public void initTest() {
        itineraryVenue = createEntity(em);
    }

    @Test
    @Transactional
    void createItineraryVenue() throws Exception {
        int databaseSizeBeforeCreate = itineraryVenueRepository.findAll().size();
        // Create the ItineraryVenue
        restItineraryVenueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryVenue))
            )
            .andExpect(status().isCreated());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeCreate + 1);
        ItineraryVenue testItineraryVenue = itineraryVenueList.get(itineraryVenueList.size() - 1);
        assertThat(testItineraryVenue.getVenueName()).isEqualTo(DEFAULT_VENUE_NAME);
        assertThat(testItineraryVenue.getVenueCost()).isEqualTo(DEFAULT_VENUE_COST);
        assertThat(testItineraryVenue.getVenueHost()).isEqualTo(DEFAULT_VENUE_HOST);
        assertThat(testItineraryVenue.getVenueAddress()).isEqualTo(DEFAULT_VENUE_ADDRESS);
    }

    @Test
    @Transactional
    void createItineraryVenueWithExistingId() throws Exception {
        // Create the ItineraryVenue with an existing ID
        itineraryVenue.setId(1L);

        int databaseSizeBeforeCreate = itineraryVenueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItineraryVenueMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryVenue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItineraryVenues() throws Exception {
        // Initialize the database
        itineraryVenueRepository.saveAndFlush(itineraryVenue);

        // Get all the itineraryVenueList
        restItineraryVenueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itineraryVenue.getId().intValue())))
            .andExpect(jsonPath("$.[*].venueName").value(hasItem(DEFAULT_VENUE_NAME)))
            .andExpect(jsonPath("$.[*].venueCost").value(hasItem(DEFAULT_VENUE_COST.doubleValue())))
            .andExpect(jsonPath("$.[*].venueHost").value(hasItem(DEFAULT_VENUE_HOST)))
            .andExpect(jsonPath("$.[*].venueAddress").value(hasItem(DEFAULT_VENUE_ADDRESS)));
    }

    @Test
    @Transactional
    void getItineraryVenue() throws Exception {
        // Initialize the database
        itineraryVenueRepository.saveAndFlush(itineraryVenue);

        // Get the itineraryVenue
        restItineraryVenueMockMvc
            .perform(get(ENTITY_API_URL_ID, itineraryVenue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itineraryVenue.getId().intValue()))
            .andExpect(jsonPath("$.venueName").value(DEFAULT_VENUE_NAME))
            .andExpect(jsonPath("$.venueCost").value(DEFAULT_VENUE_COST.doubleValue()))
            .andExpect(jsonPath("$.venueHost").value(DEFAULT_VENUE_HOST))
            .andExpect(jsonPath("$.venueAddress").value(DEFAULT_VENUE_ADDRESS));
    }

    @Test
    @Transactional
    void getNonExistingItineraryVenue() throws Exception {
        // Get the itineraryVenue
        restItineraryVenueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItineraryVenue() throws Exception {
        // Initialize the database
        itineraryVenueRepository.saveAndFlush(itineraryVenue);

        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();

        // Update the itineraryVenue
        ItineraryVenue updatedItineraryVenue = itineraryVenueRepository.findById(itineraryVenue.getId()).get();
        // Disconnect from session so that the updates on updatedItineraryVenue are not directly saved in db
        em.detach(updatedItineraryVenue);
        updatedItineraryVenue
            .venueName(UPDATED_VENUE_NAME)
            .venueCost(UPDATED_VENUE_COST)
            .venueHost(UPDATED_VENUE_HOST)
            .venueAddress(UPDATED_VENUE_ADDRESS);

        restItineraryVenueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItineraryVenue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItineraryVenue))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
        ItineraryVenue testItineraryVenue = itineraryVenueList.get(itineraryVenueList.size() - 1);
        assertThat(testItineraryVenue.getVenueName()).isEqualTo(UPDATED_VENUE_NAME);
        assertThat(testItineraryVenue.getVenueCost()).isEqualTo(UPDATED_VENUE_COST);
        assertThat(testItineraryVenue.getVenueHost()).isEqualTo(UPDATED_VENUE_HOST);
        assertThat(testItineraryVenue.getVenueAddress()).isEqualTo(UPDATED_VENUE_ADDRESS);
    }

    @Test
    @Transactional
    void putNonExistingItineraryVenue() throws Exception {
        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();
        itineraryVenue.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryVenueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itineraryVenue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryVenue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItineraryVenue() throws Exception {
        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();
        itineraryVenue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryVenueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryVenue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItineraryVenue() throws Exception {
        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();
        itineraryVenue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryVenueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryVenue)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItineraryVenueWithPatch() throws Exception {
        // Initialize the database
        itineraryVenueRepository.saveAndFlush(itineraryVenue);

        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();

        // Update the itineraryVenue using partial update
        ItineraryVenue partialUpdatedItineraryVenue = new ItineraryVenue();
        partialUpdatedItineraryVenue.setId(itineraryVenue.getId());

        partialUpdatedItineraryVenue.venueHost(UPDATED_VENUE_HOST).venueAddress(UPDATED_VENUE_ADDRESS);

        restItineraryVenueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryVenue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryVenue))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
        ItineraryVenue testItineraryVenue = itineraryVenueList.get(itineraryVenueList.size() - 1);
        assertThat(testItineraryVenue.getVenueName()).isEqualTo(DEFAULT_VENUE_NAME);
        assertThat(testItineraryVenue.getVenueCost()).isEqualTo(DEFAULT_VENUE_COST);
        assertThat(testItineraryVenue.getVenueHost()).isEqualTo(UPDATED_VENUE_HOST);
        assertThat(testItineraryVenue.getVenueAddress()).isEqualTo(UPDATED_VENUE_ADDRESS);
    }

    @Test
    @Transactional
    void fullUpdateItineraryVenueWithPatch() throws Exception {
        // Initialize the database
        itineraryVenueRepository.saveAndFlush(itineraryVenue);

        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();

        // Update the itineraryVenue using partial update
        ItineraryVenue partialUpdatedItineraryVenue = new ItineraryVenue();
        partialUpdatedItineraryVenue.setId(itineraryVenue.getId());

        partialUpdatedItineraryVenue
            .venueName(UPDATED_VENUE_NAME)
            .venueCost(UPDATED_VENUE_COST)
            .venueHost(UPDATED_VENUE_HOST)
            .venueAddress(UPDATED_VENUE_ADDRESS);

        restItineraryVenueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryVenue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryVenue))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
        ItineraryVenue testItineraryVenue = itineraryVenueList.get(itineraryVenueList.size() - 1);
        assertThat(testItineraryVenue.getVenueName()).isEqualTo(UPDATED_VENUE_NAME);
        assertThat(testItineraryVenue.getVenueCost()).isEqualTo(UPDATED_VENUE_COST);
        assertThat(testItineraryVenue.getVenueHost()).isEqualTo(UPDATED_VENUE_HOST);
        assertThat(testItineraryVenue.getVenueAddress()).isEqualTo(UPDATED_VENUE_ADDRESS);
    }

    @Test
    @Transactional
    void patchNonExistingItineraryVenue() throws Exception {
        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();
        itineraryVenue.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryVenueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itineraryVenue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryVenue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItineraryVenue() throws Exception {
        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();
        itineraryVenue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryVenueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryVenue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItineraryVenue() throws Exception {
        int databaseSizeBeforeUpdate = itineraryVenueRepository.findAll().size();
        itineraryVenue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryVenueMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itineraryVenue))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryVenue in the database
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItineraryVenue() throws Exception {
        // Initialize the database
        itineraryVenueRepository.saveAndFlush(itineraryVenue);

        int databaseSizeBeforeDelete = itineraryVenueRepository.findAll().size();

        // Delete the itineraryVenue
        restItineraryVenueMockMvc
            .perform(delete(ENTITY_API_URL_ID, itineraryVenue.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItineraryVenue> itineraryVenueList = itineraryVenueRepository.findAll();
        assertThat(itineraryVenueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
