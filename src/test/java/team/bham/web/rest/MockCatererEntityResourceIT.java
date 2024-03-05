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
import team.bham.domain.MockCatererEntity;
import team.bham.repository.MockCatererEntityRepository;

/**
 * Integration tests for the {@link MockCatererEntityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MockCatererEntityResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CUISINE = "AAAAAAAAAA";
    private static final String UPDATED_CUISINE = "BBBBBBBBBB";

    private static final Integer DEFAULT_RATING = 0;
    private static final Integer UPDATED_RATING = 1;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String DEFAULT_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mock-caterer-entities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MockCatererEntityRepository mockCatererEntityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMockCatererEntityMockMvc;

    private MockCatererEntity mockCatererEntity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MockCatererEntity createEntity(EntityManager em) {
        MockCatererEntity mockCatererEntity = new MockCatererEntity()
            .name(DEFAULT_NAME)
            .cuisine(DEFAULT_CUISINE)
            .rating(DEFAULT_RATING)
            .description(DEFAULT_DESCRIPTION)
            .quantity(DEFAULT_QUANTITY)
            .contact(DEFAULT_CONTACT);
        return mockCatererEntity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MockCatererEntity createUpdatedEntity(EntityManager em) {
        MockCatererEntity mockCatererEntity = new MockCatererEntity()
            .name(UPDATED_NAME)
            .cuisine(UPDATED_CUISINE)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .contact(UPDATED_CONTACT);
        return mockCatererEntity;
    }

    @BeforeEach
    public void initTest() {
        mockCatererEntity = createEntity(em);
    }

    @Test
    @Transactional
    void createMockCatererEntity() throws Exception {
        int databaseSizeBeforeCreate = mockCatererEntityRepository.findAll().size();
        // Create the MockCatererEntity
        restMockCatererEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isCreated());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeCreate + 1);
        MockCatererEntity testMockCatererEntity = mockCatererEntityList.get(mockCatererEntityList.size() - 1);
        assertThat(testMockCatererEntity.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMockCatererEntity.getCuisine()).isEqualTo(DEFAULT_CUISINE);
        assertThat(testMockCatererEntity.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testMockCatererEntity.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMockCatererEntity.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testMockCatererEntity.getContact()).isEqualTo(DEFAULT_CONTACT);
    }

    @Test
    @Transactional
    void createMockCatererEntityWithExistingId() throws Exception {
        // Create the MockCatererEntity with an existing ID
        mockCatererEntity.setId(1L);

        int databaseSizeBeforeCreate = mockCatererEntityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMockCatererEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRatingIsRequired() throws Exception {
        int databaseSizeBeforeTest = mockCatererEntityRepository.findAll().size();
        // set the field null
        mockCatererEntity.setRating(null);

        // Create the MockCatererEntity, which fails.

        restMockCatererEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isBadRequest());

        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMockCatererEntities() throws Exception {
        // Initialize the database
        mockCatererEntityRepository.saveAndFlush(mockCatererEntity);

        // Get all the mockCatererEntityList
        restMockCatererEntityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mockCatererEntity.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].cuisine").value(hasItem(DEFAULT_CUISINE)))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT)));
    }

    @Test
    @Transactional
    void getMockCatererEntity() throws Exception {
        // Initialize the database
        mockCatererEntityRepository.saveAndFlush(mockCatererEntity);

        // Get the mockCatererEntity
        restMockCatererEntityMockMvc
            .perform(get(ENTITY_API_URL_ID, mockCatererEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mockCatererEntity.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.cuisine").value(DEFAULT_CUISINE))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT));
    }

    @Test
    @Transactional
    void getNonExistingMockCatererEntity() throws Exception {
        // Get the mockCatererEntity
        restMockCatererEntityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMockCatererEntity() throws Exception {
        // Initialize the database
        mockCatererEntityRepository.saveAndFlush(mockCatererEntity);

        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();

        // Update the mockCatererEntity
        MockCatererEntity updatedMockCatererEntity = mockCatererEntityRepository.findById(mockCatererEntity.getId()).get();
        // Disconnect from session so that the updates on updatedMockCatererEntity are not directly saved in db
        em.detach(updatedMockCatererEntity);
        updatedMockCatererEntity
            .name(UPDATED_NAME)
            .cuisine(UPDATED_CUISINE)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .contact(UPDATED_CONTACT);

        restMockCatererEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMockCatererEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMockCatererEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
        MockCatererEntity testMockCatererEntity = mockCatererEntityList.get(mockCatererEntityList.size() - 1);
        assertThat(testMockCatererEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMockCatererEntity.getCuisine()).isEqualTo(UPDATED_CUISINE);
        assertThat(testMockCatererEntity.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testMockCatererEntity.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMockCatererEntity.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testMockCatererEntity.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void putNonExistingMockCatererEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();
        mockCatererEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMockCatererEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mockCatererEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMockCatererEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();
        mockCatererEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockCatererEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMockCatererEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();
        mockCatererEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockCatererEntityMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMockCatererEntityWithPatch() throws Exception {
        // Initialize the database
        mockCatererEntityRepository.saveAndFlush(mockCatererEntity);

        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();

        // Update the mockCatererEntity using partial update
        MockCatererEntity partialUpdatedMockCatererEntity = new MockCatererEntity();
        partialUpdatedMockCatererEntity.setId(mockCatererEntity.getId());

        partialUpdatedMockCatererEntity.cuisine(UPDATED_CUISINE).quantity(UPDATED_QUANTITY).contact(UPDATED_CONTACT);

        restMockCatererEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMockCatererEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMockCatererEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
        MockCatererEntity testMockCatererEntity = mockCatererEntityList.get(mockCatererEntityList.size() - 1);
        assertThat(testMockCatererEntity.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMockCatererEntity.getCuisine()).isEqualTo(UPDATED_CUISINE);
        assertThat(testMockCatererEntity.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testMockCatererEntity.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMockCatererEntity.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testMockCatererEntity.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void fullUpdateMockCatererEntityWithPatch() throws Exception {
        // Initialize the database
        mockCatererEntityRepository.saveAndFlush(mockCatererEntity);

        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();

        // Update the mockCatererEntity using partial update
        MockCatererEntity partialUpdatedMockCatererEntity = new MockCatererEntity();
        partialUpdatedMockCatererEntity.setId(mockCatererEntity.getId());

        partialUpdatedMockCatererEntity
            .name(UPDATED_NAME)
            .cuisine(UPDATED_CUISINE)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .contact(UPDATED_CONTACT);

        restMockCatererEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMockCatererEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMockCatererEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
        MockCatererEntity testMockCatererEntity = mockCatererEntityList.get(mockCatererEntityList.size() - 1);
        assertThat(testMockCatererEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMockCatererEntity.getCuisine()).isEqualTo(UPDATED_CUISINE);
        assertThat(testMockCatererEntity.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testMockCatererEntity.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMockCatererEntity.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testMockCatererEntity.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void patchNonExistingMockCatererEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();
        mockCatererEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMockCatererEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mockCatererEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMockCatererEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();
        mockCatererEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockCatererEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMockCatererEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockCatererEntityRepository.findAll().size();
        mockCatererEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockCatererEntityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockCatererEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MockCatererEntity in the database
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMockCatererEntity() throws Exception {
        // Initialize the database
        mockCatererEntityRepository.saveAndFlush(mockCatererEntity);

        int databaseSizeBeforeDelete = mockCatererEntityRepository.findAll().size();

        // Delete the mockCatererEntity
        restMockCatererEntityMockMvc
            .perform(delete(ENTITY_API_URL_ID, mockCatererEntity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MockCatererEntity> mockCatererEntityList = mockCatererEntityRepository.findAll();
        assertThat(mockCatererEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
