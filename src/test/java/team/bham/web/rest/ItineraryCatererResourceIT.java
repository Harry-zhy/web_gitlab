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
import team.bham.domain.ItineraryCaterer;
import team.bham.repository.ItineraryCatererRepository;

/**
 * Integration tests for the {@link ItineraryCatererResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItineraryCatererResourceIT {

    private static final String DEFAULT_CATERER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CATERER_NAME = "BBBBBBBBBB";

    private static final Float DEFAULT_CATERER_COST = 1F;
    private static final Float UPDATED_CATERER_COST = 2F;

    private static final String DEFAULT_CATERER_HOST = "AAAAAAAAAA";
    private static final String UPDATED_CATERER_HOST = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CATERER_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CATERER_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/itinerary-caterers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItineraryCatererRepository itineraryCatererRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItineraryCatererMockMvc;

    private ItineraryCaterer itineraryCaterer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryCaterer createEntity(EntityManager em) {
        ItineraryCaterer itineraryCaterer = new ItineraryCaterer()
            .catererName(DEFAULT_CATERER_NAME)
            .catererCost(DEFAULT_CATERER_COST)
            .catererHost(DEFAULT_CATERER_HOST)
            .catererTime(DEFAULT_CATERER_TIME);
        return itineraryCaterer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryCaterer createUpdatedEntity(EntityManager em) {
        ItineraryCaterer itineraryCaterer = new ItineraryCaterer()
            .catererName(UPDATED_CATERER_NAME)
            .catererCost(UPDATED_CATERER_COST)
            .catererHost(UPDATED_CATERER_HOST)
            .catererTime(UPDATED_CATERER_TIME);
        return itineraryCaterer;
    }

    @BeforeEach
    public void initTest() {
        itineraryCaterer = createEntity(em);
    }

    @Test
    @Transactional
    void createItineraryCaterer() throws Exception {
        int databaseSizeBeforeCreate = itineraryCatererRepository.findAll().size();
        // Create the ItineraryCaterer
        restItineraryCatererMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryCaterer))
            )
            .andExpect(status().isCreated());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeCreate + 1);
        ItineraryCaterer testItineraryCaterer = itineraryCatererList.get(itineraryCatererList.size() - 1);
        assertThat(testItineraryCaterer.getCatererName()).isEqualTo(DEFAULT_CATERER_NAME);
        assertThat(testItineraryCaterer.getCatererCost()).isEqualTo(DEFAULT_CATERER_COST);
        assertThat(testItineraryCaterer.getCatererHost()).isEqualTo(DEFAULT_CATERER_HOST);
        assertThat(testItineraryCaterer.getCatererTime()).isEqualTo(DEFAULT_CATERER_TIME);
    }

    @Test
    @Transactional
    void createItineraryCatererWithExistingId() throws Exception {
        // Create the ItineraryCaterer with an existing ID
        itineraryCaterer.setId(1L);

        int databaseSizeBeforeCreate = itineraryCatererRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItineraryCatererMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItineraryCaterers() throws Exception {
        // Initialize the database
        itineraryCatererRepository.saveAndFlush(itineraryCaterer);

        // Get all the itineraryCatererList
        restItineraryCatererMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itineraryCaterer.getId().intValue())))
            .andExpect(jsonPath("$.[*].catererName").value(hasItem(DEFAULT_CATERER_NAME)))
            .andExpect(jsonPath("$.[*].catererCost").value(hasItem(DEFAULT_CATERER_COST.doubleValue())))
            .andExpect(jsonPath("$.[*].catererHost").value(hasItem(DEFAULT_CATERER_HOST)))
            .andExpect(jsonPath("$.[*].catererTime").value(hasItem(sameInstant(DEFAULT_CATERER_TIME))));
    }

    @Test
    @Transactional
    void getItineraryCaterer() throws Exception {
        // Initialize the database
        itineraryCatererRepository.saveAndFlush(itineraryCaterer);

        // Get the itineraryCaterer
        restItineraryCatererMockMvc
            .perform(get(ENTITY_API_URL_ID, itineraryCaterer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itineraryCaterer.getId().intValue()))
            .andExpect(jsonPath("$.catererName").value(DEFAULT_CATERER_NAME))
            .andExpect(jsonPath("$.catererCost").value(DEFAULT_CATERER_COST.doubleValue()))
            .andExpect(jsonPath("$.catererHost").value(DEFAULT_CATERER_HOST))
            .andExpect(jsonPath("$.catererTime").value(sameInstant(DEFAULT_CATERER_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingItineraryCaterer() throws Exception {
        // Get the itineraryCaterer
        restItineraryCatererMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItineraryCaterer() throws Exception {
        // Initialize the database
        itineraryCatererRepository.saveAndFlush(itineraryCaterer);

        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();

        // Update the itineraryCaterer
        ItineraryCaterer updatedItineraryCaterer = itineraryCatererRepository.findById(itineraryCaterer.getId()).get();
        // Disconnect from session so that the updates on updatedItineraryCaterer are not directly saved in db
        em.detach(updatedItineraryCaterer);
        updatedItineraryCaterer
            .catererName(UPDATED_CATERER_NAME)
            .catererCost(UPDATED_CATERER_COST)
            .catererHost(UPDATED_CATERER_HOST)
            .catererTime(UPDATED_CATERER_TIME);

        restItineraryCatererMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItineraryCaterer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItineraryCaterer))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
        ItineraryCaterer testItineraryCaterer = itineraryCatererList.get(itineraryCatererList.size() - 1);
        assertThat(testItineraryCaterer.getCatererName()).isEqualTo(UPDATED_CATERER_NAME);
        assertThat(testItineraryCaterer.getCatererCost()).isEqualTo(UPDATED_CATERER_COST);
        assertThat(testItineraryCaterer.getCatererHost()).isEqualTo(UPDATED_CATERER_HOST);
        assertThat(testItineraryCaterer.getCatererTime()).isEqualTo(UPDATED_CATERER_TIME);
    }

    @Test
    @Transactional
    void putNonExistingItineraryCaterer() throws Exception {
        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();
        itineraryCaterer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryCatererMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itineraryCaterer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItineraryCaterer() throws Exception {
        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();
        itineraryCaterer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryCatererMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItineraryCaterer() throws Exception {
        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();
        itineraryCaterer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryCatererMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryCaterer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItineraryCatererWithPatch() throws Exception {
        // Initialize the database
        itineraryCatererRepository.saveAndFlush(itineraryCaterer);

        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();

        // Update the itineraryCaterer using partial update
        ItineraryCaterer partialUpdatedItineraryCaterer = new ItineraryCaterer();
        partialUpdatedItineraryCaterer.setId(itineraryCaterer.getId());

        partialUpdatedItineraryCaterer.catererName(UPDATED_CATERER_NAME);

        restItineraryCatererMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryCaterer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryCaterer))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
        ItineraryCaterer testItineraryCaterer = itineraryCatererList.get(itineraryCatererList.size() - 1);
        assertThat(testItineraryCaterer.getCatererName()).isEqualTo(UPDATED_CATERER_NAME);
        assertThat(testItineraryCaterer.getCatererCost()).isEqualTo(DEFAULT_CATERER_COST);
        assertThat(testItineraryCaterer.getCatererHost()).isEqualTo(DEFAULT_CATERER_HOST);
        assertThat(testItineraryCaterer.getCatererTime()).isEqualTo(DEFAULT_CATERER_TIME);
    }

    @Test
    @Transactional
    void fullUpdateItineraryCatererWithPatch() throws Exception {
        // Initialize the database
        itineraryCatererRepository.saveAndFlush(itineraryCaterer);

        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();

        // Update the itineraryCaterer using partial update
        ItineraryCaterer partialUpdatedItineraryCaterer = new ItineraryCaterer();
        partialUpdatedItineraryCaterer.setId(itineraryCaterer.getId());

        partialUpdatedItineraryCaterer
            .catererName(UPDATED_CATERER_NAME)
            .catererCost(UPDATED_CATERER_COST)
            .catererHost(UPDATED_CATERER_HOST)
            .catererTime(UPDATED_CATERER_TIME);

        restItineraryCatererMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryCaterer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryCaterer))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
        ItineraryCaterer testItineraryCaterer = itineraryCatererList.get(itineraryCatererList.size() - 1);
        assertThat(testItineraryCaterer.getCatererName()).isEqualTo(UPDATED_CATERER_NAME);
        assertThat(testItineraryCaterer.getCatererCost()).isEqualTo(UPDATED_CATERER_COST);
        assertThat(testItineraryCaterer.getCatererHost()).isEqualTo(UPDATED_CATERER_HOST);
        assertThat(testItineraryCaterer.getCatererTime()).isEqualTo(UPDATED_CATERER_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingItineraryCaterer() throws Exception {
        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();
        itineraryCaterer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryCatererMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itineraryCaterer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItineraryCaterer() throws Exception {
        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();
        itineraryCaterer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryCatererMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryCaterer))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItineraryCaterer() throws Exception {
        int databaseSizeBeforeUpdate = itineraryCatererRepository.findAll().size();
        itineraryCaterer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryCatererMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryCaterer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryCaterer in the database
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItineraryCaterer() throws Exception {
        // Initialize the database
        itineraryCatererRepository.saveAndFlush(itineraryCaterer);

        int databaseSizeBeforeDelete = itineraryCatererRepository.findAll().size();

        // Delete the itineraryCaterer
        restItineraryCatererMockMvc
            .perform(delete(ENTITY_API_URL_ID, itineraryCaterer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItineraryCaterer> itineraryCatererList = itineraryCatererRepository.findAll();
        assertThat(itineraryCatererList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
