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
import team.bham.domain.ItineraryDateTime;
import team.bham.repository.ItineraryDateTimeRepository;

/**
 * Integration tests for the {@link ItineraryDateTimeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItineraryDateTimeResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_START_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/itinerary-date-times";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItineraryDateTimeRepository itineraryDateTimeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItineraryDateTimeMockMvc;

    private ItineraryDateTime itineraryDateTime;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryDateTime createEntity(EntityManager em) {
        ItineraryDateTime itineraryDateTime = new ItineraryDateTime()
            .date(DEFAULT_DATE)
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME);
        return itineraryDateTime;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryDateTime createUpdatedEntity(EntityManager em) {
        ItineraryDateTime itineraryDateTime = new ItineraryDateTime()
            .date(UPDATED_DATE)
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME);
        return itineraryDateTime;
    }

    @BeforeEach
    public void initTest() {
        itineraryDateTime = createEntity(em);
    }

    @Test
    @Transactional
    void createItineraryDateTime() throws Exception {
        int databaseSizeBeforeCreate = itineraryDateTimeRepository.findAll().size();
        // Create the ItineraryDateTime
        restItineraryDateTimeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryDateTime))
            )
            .andExpect(status().isCreated());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeCreate + 1);
        ItineraryDateTime testItineraryDateTime = itineraryDateTimeList.get(itineraryDateTimeList.size() - 1);
        assertThat(testItineraryDateTime.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testItineraryDateTime.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testItineraryDateTime.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void createItineraryDateTimeWithExistingId() throws Exception {
        // Create the ItineraryDateTime with an existing ID
        itineraryDateTime.setId(1L);

        int databaseSizeBeforeCreate = itineraryDateTimeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItineraryDateTimeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryDateTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItineraryDateTimes() throws Exception {
        // Initialize the database
        itineraryDateTimeRepository.saveAndFlush(itineraryDateTime);

        // Get all the itineraryDateTimeList
        restItineraryDateTimeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itineraryDateTime.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(sameInstant(DEFAULT_START_TIME))))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(sameInstant(DEFAULT_END_TIME))));
    }

    @Test
    @Transactional
    void getItineraryDateTime() throws Exception {
        // Initialize the database
        itineraryDateTimeRepository.saveAndFlush(itineraryDateTime);

        // Get the itineraryDateTime
        restItineraryDateTimeMockMvc
            .perform(get(ENTITY_API_URL_ID, itineraryDateTime.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itineraryDateTime.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.startTime").value(sameInstant(DEFAULT_START_TIME)))
            .andExpect(jsonPath("$.endTime").value(sameInstant(DEFAULT_END_TIME)));
    }

    @Test
    @Transactional
    void getNonExistingItineraryDateTime() throws Exception {
        // Get the itineraryDateTime
        restItineraryDateTimeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItineraryDateTime() throws Exception {
        // Initialize the database
        itineraryDateTimeRepository.saveAndFlush(itineraryDateTime);

        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();

        // Update the itineraryDateTime
        ItineraryDateTime updatedItineraryDateTime = itineraryDateTimeRepository.findById(itineraryDateTime.getId()).get();
        // Disconnect from session so that the updates on updatedItineraryDateTime are not directly saved in db
        em.detach(updatedItineraryDateTime);
        updatedItineraryDateTime.date(UPDATED_DATE).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restItineraryDateTimeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItineraryDateTime.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItineraryDateTime))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
        ItineraryDateTime testItineraryDateTime = itineraryDateTimeList.get(itineraryDateTimeList.size() - 1);
        assertThat(testItineraryDateTime.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testItineraryDateTime.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testItineraryDateTime.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void putNonExistingItineraryDateTime() throws Exception {
        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();
        itineraryDateTime.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryDateTimeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itineraryDateTime.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryDateTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItineraryDateTime() throws Exception {
        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();
        itineraryDateTime.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryDateTimeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryDateTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItineraryDateTime() throws Exception {
        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();
        itineraryDateTime.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryDateTimeMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryDateTime))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItineraryDateTimeWithPatch() throws Exception {
        // Initialize the database
        itineraryDateTimeRepository.saveAndFlush(itineraryDateTime);

        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();

        // Update the itineraryDateTime using partial update
        ItineraryDateTime partialUpdatedItineraryDateTime = new ItineraryDateTime();
        partialUpdatedItineraryDateTime.setId(itineraryDateTime.getId());

        partialUpdatedItineraryDateTime.startTime(UPDATED_START_TIME);

        restItineraryDateTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryDateTime.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryDateTime))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
        ItineraryDateTime testItineraryDateTime = itineraryDateTimeList.get(itineraryDateTimeList.size() - 1);
        assertThat(testItineraryDateTime.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testItineraryDateTime.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testItineraryDateTime.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void fullUpdateItineraryDateTimeWithPatch() throws Exception {
        // Initialize the database
        itineraryDateTimeRepository.saveAndFlush(itineraryDateTime);

        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();

        // Update the itineraryDateTime using partial update
        ItineraryDateTime partialUpdatedItineraryDateTime = new ItineraryDateTime();
        partialUpdatedItineraryDateTime.setId(itineraryDateTime.getId());

        partialUpdatedItineraryDateTime.date(UPDATED_DATE).startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restItineraryDateTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryDateTime.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryDateTime))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
        ItineraryDateTime testItineraryDateTime = itineraryDateTimeList.get(itineraryDateTimeList.size() - 1);
        assertThat(testItineraryDateTime.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testItineraryDateTime.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testItineraryDateTime.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingItineraryDateTime() throws Exception {
        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();
        itineraryDateTime.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryDateTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itineraryDateTime.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryDateTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItineraryDateTime() throws Exception {
        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();
        itineraryDateTime.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryDateTimeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryDateTime))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItineraryDateTime() throws Exception {
        int databaseSizeBeforeUpdate = itineraryDateTimeRepository.findAll().size();
        itineraryDateTime.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryDateTimeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryDateTime))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryDateTime in the database
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItineraryDateTime() throws Exception {
        // Initialize the database
        itineraryDateTimeRepository.saveAndFlush(itineraryDateTime);

        int databaseSizeBeforeDelete = itineraryDateTimeRepository.findAll().size();

        // Delete the itineraryDateTime
        restItineraryDateTimeMockMvc
            .perform(delete(ENTITY_API_URL_ID, itineraryDateTime.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItineraryDateTime> itineraryDateTimeList = itineraryDateTimeRepository.findAll();
        assertThat(itineraryDateTimeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
