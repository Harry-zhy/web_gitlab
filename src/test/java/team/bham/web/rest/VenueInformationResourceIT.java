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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.VenueInformation;
import team.bham.repository.VenueInformationRepository;

/**
 * Integration tests for the {@link VenueInformationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VenueInformationResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;

    private static final Integer DEFAULT_CAPACITY = 1;
    private static final Integer UPDATED_CAPACITY = 2;

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_OPENING_TIME_FROM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_OPENING_TIME_FROM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_OPENING_TIME_UNTIL = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_OPENING_TIME_UNTIL = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/venue-informations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VenueInformationRepository venueInformationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVenueInformationMockMvc;

    private VenueInformation venueInformation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VenueInformation createEntity(EntityManager em) {
        VenueInformation venueInformation = new VenueInformation()
            .name(DEFAULT_NAME)
            .price(DEFAULT_PRICE)
            .capacity(DEFAULT_CAPACITY)
            .location(DEFAULT_LOCATION)
            .openingTimeFrom(DEFAULT_OPENING_TIME_FROM)
            .openingTimeUntil(DEFAULT_OPENING_TIME_UNTIL)
            .picture(DEFAULT_PICTURE)
            .pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE);
        return venueInformation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VenueInformation createUpdatedEntity(EntityManager em) {
        VenueInformation venueInformation = new VenueInformation()
            .name(UPDATED_NAME)
            .price(UPDATED_PRICE)
            .capacity(UPDATED_CAPACITY)
            .location(UPDATED_LOCATION)
            .openingTimeFrom(UPDATED_OPENING_TIME_FROM)
            .openingTimeUntil(UPDATED_OPENING_TIME_UNTIL)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);
        return venueInformation;
    }

    @BeforeEach
    public void initTest() {
        venueInformation = createEntity(em);
    }

    @Test
    @Transactional
    void createVenueInformation() throws Exception {
        int databaseSizeBeforeCreate = venueInformationRepository.findAll().size();
        // Create the VenueInformation
        restVenueInformationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(venueInformation))
            )
            .andExpect(status().isCreated());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeCreate + 1);
        VenueInformation testVenueInformation = venueInformationList.get(venueInformationList.size() - 1);
        assertThat(testVenueInformation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testVenueInformation.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testVenueInformation.getCapacity()).isEqualTo(DEFAULT_CAPACITY);
        assertThat(testVenueInformation.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testVenueInformation.getOpeningTimeFrom()).isEqualTo(DEFAULT_OPENING_TIME_FROM);
        assertThat(testVenueInformation.getOpeningTimeUntil()).isEqualTo(DEFAULT_OPENING_TIME_UNTIL);
        assertThat(testVenueInformation.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testVenueInformation.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createVenueInformationWithExistingId() throws Exception {
        // Create the VenueInformation with an existing ID
        venueInformation.setId(1L);

        int databaseSizeBeforeCreate = venueInformationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVenueInformationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(venueInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVenueInformations() throws Exception {
        // Initialize the database
        venueInformationRepository.saveAndFlush(venueInformation);

        // Get all the venueInformationList
        restVenueInformationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(venueInformation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].openingTimeFrom").value(hasItem(sameInstant(DEFAULT_OPENING_TIME_FROM))))
            .andExpect(jsonPath("$.[*].openingTimeUntil").value(hasItem(sameInstant(DEFAULT_OPENING_TIME_UNTIL))))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))));
    }

    @Test
    @Transactional
    void getVenueInformation() throws Exception {
        // Initialize the database
        venueInformationRepository.saveAndFlush(venueInformation);

        // Get the venueInformation
        restVenueInformationMockMvc
            .perform(get(ENTITY_API_URL_ID, venueInformation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(venueInformation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.openingTimeFrom").value(sameInstant(DEFAULT_OPENING_TIME_FROM)))
            .andExpect(jsonPath("$.openingTimeUntil").value(sameInstant(DEFAULT_OPENING_TIME_UNTIL)))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)));
    }

    @Test
    @Transactional
    void getNonExistingVenueInformation() throws Exception {
        // Get the venueInformation
        restVenueInformationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVenueInformation() throws Exception {
        // Initialize the database
        venueInformationRepository.saveAndFlush(venueInformation);

        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();

        // Update the venueInformation
        VenueInformation updatedVenueInformation = venueInformationRepository.findById(venueInformation.getId()).get();
        // Disconnect from session so that the updates on updatedVenueInformation are not directly saved in db
        em.detach(updatedVenueInformation);
        updatedVenueInformation
            .name(UPDATED_NAME)
            .price(UPDATED_PRICE)
            .capacity(UPDATED_CAPACITY)
            .location(UPDATED_LOCATION)
            .openingTimeFrom(UPDATED_OPENING_TIME_FROM)
            .openingTimeUntil(UPDATED_OPENING_TIME_UNTIL)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restVenueInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVenueInformation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVenueInformation))
            )
            .andExpect(status().isOk());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
        VenueInformation testVenueInformation = venueInformationList.get(venueInformationList.size() - 1);
        assertThat(testVenueInformation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVenueInformation.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testVenueInformation.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testVenueInformation.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testVenueInformation.getOpeningTimeFrom()).isEqualTo(UPDATED_OPENING_TIME_FROM);
        assertThat(testVenueInformation.getOpeningTimeUntil()).isEqualTo(UPDATED_OPENING_TIME_UNTIL);
        assertThat(testVenueInformation.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testVenueInformation.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingVenueInformation() throws Exception {
        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();
        venueInformation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVenueInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, venueInformation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(venueInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVenueInformation() throws Exception {
        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();
        venueInformation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVenueInformationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(venueInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVenueInformation() throws Exception {
        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();
        venueInformation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVenueInformationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(venueInformation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVenueInformationWithPatch() throws Exception {
        // Initialize the database
        venueInformationRepository.saveAndFlush(venueInformation);

        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();

        // Update the venueInformation using partial update
        VenueInformation partialUpdatedVenueInformation = new VenueInformation();
        partialUpdatedVenueInformation.setId(venueInformation.getId());

        partialUpdatedVenueInformation
            .capacity(UPDATED_CAPACITY)
            .location(UPDATED_LOCATION)
            .openingTimeFrom(UPDATED_OPENING_TIME_FROM)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restVenueInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVenueInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVenueInformation))
            )
            .andExpect(status().isOk());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
        VenueInformation testVenueInformation = venueInformationList.get(venueInformationList.size() - 1);
        assertThat(testVenueInformation.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testVenueInformation.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testVenueInformation.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testVenueInformation.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testVenueInformation.getOpeningTimeFrom()).isEqualTo(UPDATED_OPENING_TIME_FROM);
        assertThat(testVenueInformation.getOpeningTimeUntil()).isEqualTo(DEFAULT_OPENING_TIME_UNTIL);
        assertThat(testVenueInformation.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testVenueInformation.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateVenueInformationWithPatch() throws Exception {
        // Initialize the database
        venueInformationRepository.saveAndFlush(venueInformation);

        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();

        // Update the venueInformation using partial update
        VenueInformation partialUpdatedVenueInformation = new VenueInformation();
        partialUpdatedVenueInformation.setId(venueInformation.getId());

        partialUpdatedVenueInformation
            .name(UPDATED_NAME)
            .price(UPDATED_PRICE)
            .capacity(UPDATED_CAPACITY)
            .location(UPDATED_LOCATION)
            .openingTimeFrom(UPDATED_OPENING_TIME_FROM)
            .openingTimeUntil(UPDATED_OPENING_TIME_UNTIL)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restVenueInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVenueInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVenueInformation))
            )
            .andExpect(status().isOk());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
        VenueInformation testVenueInformation = venueInformationList.get(venueInformationList.size() - 1);
        assertThat(testVenueInformation.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testVenueInformation.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testVenueInformation.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testVenueInformation.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testVenueInformation.getOpeningTimeFrom()).isEqualTo(UPDATED_OPENING_TIME_FROM);
        assertThat(testVenueInformation.getOpeningTimeUntil()).isEqualTo(UPDATED_OPENING_TIME_UNTIL);
        assertThat(testVenueInformation.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testVenueInformation.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingVenueInformation() throws Exception {
        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();
        venueInformation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVenueInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, venueInformation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(venueInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVenueInformation() throws Exception {
        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();
        venueInformation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVenueInformationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(venueInformation))
            )
            .andExpect(status().isBadRequest());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVenueInformation() throws Exception {
        int databaseSizeBeforeUpdate = venueInformationRepository.findAll().size();
        venueInformation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVenueInformationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(venueInformation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the VenueInformation in the database
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVenueInformation() throws Exception {
        // Initialize the database
        venueInformationRepository.saveAndFlush(venueInformation);

        int databaseSizeBeforeDelete = venueInformationRepository.findAll().size();

        // Delete the venueInformation
        restVenueInformationMockMvc
            .perform(delete(ENTITY_API_URL_ID, venueInformation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<VenueInformation> venueInformationList = venueInformationRepository.findAll();
        assertThat(venueInformationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
