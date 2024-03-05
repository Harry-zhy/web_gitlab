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
import team.bham.domain.MockVenueEntity;
import team.bham.repository.MockVenueEntityRepository;

/**
 * Integration tests for the {@link MockVenueEntityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MockVenueEntityResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final Integer DEFAULT_RATING = 0;
    private static final Integer UPDATED_RATING = 1;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mock-venue-entities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MockVenueEntityRepository mockVenueEntityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMockVenueEntityMockMvc;

    private MockVenueEntity mockVenueEntity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MockVenueEntity createEntity(EntityManager em) {
        MockVenueEntity mockVenueEntity = new MockVenueEntity()
            .name(DEFAULT_NAME)
            .companyName(DEFAULT_COMPANY_NAME)
            .location(DEFAULT_LOCATION)
            .rating(DEFAULT_RATING)
            .description(DEFAULT_DESCRIPTION)
            .contact(DEFAULT_CONTACT);
        return mockVenueEntity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MockVenueEntity createUpdatedEntity(EntityManager em) {
        MockVenueEntity mockVenueEntity = new MockVenueEntity()
            .name(UPDATED_NAME)
            .companyName(UPDATED_COMPANY_NAME)
            .location(UPDATED_LOCATION)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .contact(UPDATED_CONTACT);
        return mockVenueEntity;
    }

    @BeforeEach
    public void initTest() {
        mockVenueEntity = createEntity(em);
    }

    @Test
    @Transactional
    void createMockVenueEntity() throws Exception {
        int databaseSizeBeforeCreate = mockVenueEntityRepository.findAll().size();
        // Create the MockVenueEntity
        restMockVenueEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isCreated());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeCreate + 1);
        MockVenueEntity testMockVenueEntity = mockVenueEntityList.get(mockVenueEntityList.size() - 1);
        assertThat(testMockVenueEntity.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMockVenueEntity.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testMockVenueEntity.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testMockVenueEntity.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testMockVenueEntity.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMockVenueEntity.getContact()).isEqualTo(DEFAULT_CONTACT);
    }

    @Test
    @Transactional
    void createMockVenueEntityWithExistingId() throws Exception {
        // Create the MockVenueEntity with an existing ID
        mockVenueEntity.setId(1L);

        int databaseSizeBeforeCreate = mockVenueEntityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMockVenueEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRatingIsRequired() throws Exception {
        int databaseSizeBeforeTest = mockVenueEntityRepository.findAll().size();
        // set the field null
        mockVenueEntity.setRating(null);

        // Create the MockVenueEntity, which fails.

        restMockVenueEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isBadRequest());

        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMockVenueEntities() throws Exception {
        // Initialize the database
        mockVenueEntityRepository.saveAndFlush(mockVenueEntity);

        // Get all the mockVenueEntityList
        restMockVenueEntityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mockVenueEntity.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT)));
    }

    @Test
    @Transactional
    void getMockVenueEntity() throws Exception {
        // Initialize the database
        mockVenueEntityRepository.saveAndFlush(mockVenueEntity);

        // Get the mockVenueEntity
        restMockVenueEntityMockMvc
            .perform(get(ENTITY_API_URL_ID, mockVenueEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mockVenueEntity.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT));
    }

    @Test
    @Transactional
    void getNonExistingMockVenueEntity() throws Exception {
        // Get the mockVenueEntity
        restMockVenueEntityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMockVenueEntity() throws Exception {
        // Initialize the database
        mockVenueEntityRepository.saveAndFlush(mockVenueEntity);

        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();

        // Update the mockVenueEntity
        MockVenueEntity updatedMockVenueEntity = mockVenueEntityRepository.findById(mockVenueEntity.getId()).get();
        // Disconnect from session so that the updates on updatedMockVenueEntity are not directly saved in db
        em.detach(updatedMockVenueEntity);
        updatedMockVenueEntity
            .name(UPDATED_NAME)
            .companyName(UPDATED_COMPANY_NAME)
            .location(UPDATED_LOCATION)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .contact(UPDATED_CONTACT);

        restMockVenueEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMockVenueEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMockVenueEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
        MockVenueEntity testMockVenueEntity = mockVenueEntityList.get(mockVenueEntityList.size() - 1);
        assertThat(testMockVenueEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMockVenueEntity.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testMockVenueEntity.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testMockVenueEntity.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testMockVenueEntity.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMockVenueEntity.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void putNonExistingMockVenueEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();
        mockVenueEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMockVenueEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mockVenueEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMockVenueEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();
        mockVenueEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockVenueEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMockVenueEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();
        mockVenueEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockVenueEntityMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMockVenueEntityWithPatch() throws Exception {
        // Initialize the database
        mockVenueEntityRepository.saveAndFlush(mockVenueEntity);

        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();

        // Update the mockVenueEntity using partial update
        MockVenueEntity partialUpdatedMockVenueEntity = new MockVenueEntity();
        partialUpdatedMockVenueEntity.setId(mockVenueEntity.getId());

        partialUpdatedMockVenueEntity
            .name(UPDATED_NAME)
            .companyName(UPDATED_COMPANY_NAME)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .contact(UPDATED_CONTACT);

        restMockVenueEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMockVenueEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMockVenueEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
        MockVenueEntity testMockVenueEntity = mockVenueEntityList.get(mockVenueEntityList.size() - 1);
        assertThat(testMockVenueEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMockVenueEntity.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testMockVenueEntity.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testMockVenueEntity.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testMockVenueEntity.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMockVenueEntity.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void fullUpdateMockVenueEntityWithPatch() throws Exception {
        // Initialize the database
        mockVenueEntityRepository.saveAndFlush(mockVenueEntity);

        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();

        // Update the mockVenueEntity using partial update
        MockVenueEntity partialUpdatedMockVenueEntity = new MockVenueEntity();
        partialUpdatedMockVenueEntity.setId(mockVenueEntity.getId());

        partialUpdatedMockVenueEntity
            .name(UPDATED_NAME)
            .companyName(UPDATED_COMPANY_NAME)
            .location(UPDATED_LOCATION)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .contact(UPDATED_CONTACT);

        restMockVenueEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMockVenueEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMockVenueEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
        MockVenueEntity testMockVenueEntity = mockVenueEntityList.get(mockVenueEntityList.size() - 1);
        assertThat(testMockVenueEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMockVenueEntity.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testMockVenueEntity.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testMockVenueEntity.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testMockVenueEntity.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMockVenueEntity.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void patchNonExistingMockVenueEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();
        mockVenueEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMockVenueEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mockVenueEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMockVenueEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();
        mockVenueEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockVenueEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMockVenueEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockVenueEntityRepository.findAll().size();
        mockVenueEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockVenueEntityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockVenueEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MockVenueEntity in the database
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMockVenueEntity() throws Exception {
        // Initialize the database
        mockVenueEntityRepository.saveAndFlush(mockVenueEntity);

        int databaseSizeBeforeDelete = mockVenueEntityRepository.findAll().size();

        // Delete the mockVenueEntity
        restMockVenueEntityMockMvc
            .perform(delete(ENTITY_API_URL_ID, mockVenueEntity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MockVenueEntity> mockVenueEntityList = mockVenueEntityRepository.findAll();
        assertThat(mockVenueEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
