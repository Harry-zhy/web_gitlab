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
import team.bham.domain.MockActivityEntity;
import team.bham.repository.MockActivityEntityRepository;

/**
 * Integration tests for the {@link MockActivityEntityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MockActivityEntityResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_RATING = 0;
    private static final Integer UPDATED_RATING = 1;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String DEFAULT_CONTACT = "AAAAAAAAAA";
    private static final String UPDATED_CONTACT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mock-activity-entities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MockActivityEntityRepository mockActivityEntityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMockActivityEntityMockMvc;

    private MockActivityEntity mockActivityEntity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MockActivityEntity createEntity(EntityManager em) {
        MockActivityEntity mockActivityEntity = new MockActivityEntity()
            .name(DEFAULT_NAME)
            .companyName(DEFAULT_COMPANY_NAME)
            .rating(DEFAULT_RATING)
            .description(DEFAULT_DESCRIPTION)
            .quantity(DEFAULT_QUANTITY)
            .contact(DEFAULT_CONTACT);
        return mockActivityEntity;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MockActivityEntity createUpdatedEntity(EntityManager em) {
        MockActivityEntity mockActivityEntity = new MockActivityEntity()
            .name(UPDATED_NAME)
            .companyName(UPDATED_COMPANY_NAME)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .contact(UPDATED_CONTACT);
        return mockActivityEntity;
    }

    @BeforeEach
    public void initTest() {
        mockActivityEntity = createEntity(em);
    }

    @Test
    @Transactional
    void createMockActivityEntity() throws Exception {
        int databaseSizeBeforeCreate = mockActivityEntityRepository.findAll().size();
        // Create the MockActivityEntity
        restMockActivityEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isCreated());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeCreate + 1);
        MockActivityEntity testMockActivityEntity = mockActivityEntityList.get(mockActivityEntityList.size() - 1);
        assertThat(testMockActivityEntity.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMockActivityEntity.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testMockActivityEntity.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testMockActivityEntity.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMockActivityEntity.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testMockActivityEntity.getContact()).isEqualTo(DEFAULT_CONTACT);
    }

    @Test
    @Transactional
    void createMockActivityEntityWithExistingId() throws Exception {
        // Create the MockActivityEntity with an existing ID
        mockActivityEntity.setId(1L);

        int databaseSizeBeforeCreate = mockActivityEntityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMockActivityEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkRatingIsRequired() throws Exception {
        int databaseSizeBeforeTest = mockActivityEntityRepository.findAll().size();
        // set the field null
        mockActivityEntity.setRating(null);

        // Create the MockActivityEntity, which fails.

        restMockActivityEntityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isBadRequest());

        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMockActivityEntities() throws Exception {
        // Initialize the database
        mockActivityEntityRepository.saveAndFlush(mockActivityEntity);

        // Get all the mockActivityEntityList
        restMockActivityEntityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mockActivityEntity.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].contact").value(hasItem(DEFAULT_CONTACT)));
    }

    @Test
    @Transactional
    void getMockActivityEntity() throws Exception {
        // Initialize the database
        mockActivityEntityRepository.saveAndFlush(mockActivityEntity);

        // Get the mockActivityEntity
        restMockActivityEntityMockMvc
            .perform(get(ENTITY_API_URL_ID, mockActivityEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mockActivityEntity.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.contact").value(DEFAULT_CONTACT));
    }

    @Test
    @Transactional
    void getNonExistingMockActivityEntity() throws Exception {
        // Get the mockActivityEntity
        restMockActivityEntityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMockActivityEntity() throws Exception {
        // Initialize the database
        mockActivityEntityRepository.saveAndFlush(mockActivityEntity);

        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();

        // Update the mockActivityEntity
        MockActivityEntity updatedMockActivityEntity = mockActivityEntityRepository.findById(mockActivityEntity.getId()).get();
        // Disconnect from session so that the updates on updatedMockActivityEntity are not directly saved in db
        em.detach(updatedMockActivityEntity);
        updatedMockActivityEntity
            .name(UPDATED_NAME)
            .companyName(UPDATED_COMPANY_NAME)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .contact(UPDATED_CONTACT);

        restMockActivityEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMockActivityEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMockActivityEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
        MockActivityEntity testMockActivityEntity = mockActivityEntityList.get(mockActivityEntityList.size() - 1);
        assertThat(testMockActivityEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMockActivityEntity.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testMockActivityEntity.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testMockActivityEntity.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMockActivityEntity.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testMockActivityEntity.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void putNonExistingMockActivityEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();
        mockActivityEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMockActivityEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mockActivityEntity.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMockActivityEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();
        mockActivityEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockActivityEntityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMockActivityEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();
        mockActivityEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockActivityEntityMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMockActivityEntityWithPatch() throws Exception {
        // Initialize the database
        mockActivityEntityRepository.saveAndFlush(mockActivityEntity);

        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();

        // Update the mockActivityEntity using partial update
        MockActivityEntity partialUpdatedMockActivityEntity = new MockActivityEntity();
        partialUpdatedMockActivityEntity.setId(mockActivityEntity.getId());

        partialUpdatedMockActivityEntity.name(UPDATED_NAME).quantity(UPDATED_QUANTITY);

        restMockActivityEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMockActivityEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMockActivityEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
        MockActivityEntity testMockActivityEntity = mockActivityEntityList.get(mockActivityEntityList.size() - 1);
        assertThat(testMockActivityEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMockActivityEntity.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testMockActivityEntity.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testMockActivityEntity.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMockActivityEntity.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testMockActivityEntity.getContact()).isEqualTo(DEFAULT_CONTACT);
    }

    @Test
    @Transactional
    void fullUpdateMockActivityEntityWithPatch() throws Exception {
        // Initialize the database
        mockActivityEntityRepository.saveAndFlush(mockActivityEntity);

        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();

        // Update the mockActivityEntity using partial update
        MockActivityEntity partialUpdatedMockActivityEntity = new MockActivityEntity();
        partialUpdatedMockActivityEntity.setId(mockActivityEntity.getId());

        partialUpdatedMockActivityEntity
            .name(UPDATED_NAME)
            .companyName(UPDATED_COMPANY_NAME)
            .rating(UPDATED_RATING)
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .contact(UPDATED_CONTACT);

        restMockActivityEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMockActivityEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMockActivityEntity))
            )
            .andExpect(status().isOk());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
        MockActivityEntity testMockActivityEntity = mockActivityEntityList.get(mockActivityEntityList.size() - 1);
        assertThat(testMockActivityEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMockActivityEntity.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testMockActivityEntity.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testMockActivityEntity.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMockActivityEntity.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testMockActivityEntity.getContact()).isEqualTo(UPDATED_CONTACT);
    }

    @Test
    @Transactional
    void patchNonExistingMockActivityEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();
        mockActivityEntity.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMockActivityEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mockActivityEntity.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMockActivityEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();
        mockActivityEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockActivityEntityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isBadRequest());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMockActivityEntity() throws Exception {
        int databaseSizeBeforeUpdate = mockActivityEntityRepository.findAll().size();
        mockActivityEntity.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMockActivityEntityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mockActivityEntity))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MockActivityEntity in the database
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMockActivityEntity() throws Exception {
        // Initialize the database
        mockActivityEntityRepository.saveAndFlush(mockActivityEntity);

        int databaseSizeBeforeDelete = mockActivityEntityRepository.findAll().size();

        // Delete the mockActivityEntity
        restMockActivityEntityMockMvc
            .perform(delete(ENTITY_API_URL_ID, mockActivityEntity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MockActivityEntity> mockActivityEntityList = mockActivityEntityRepository.findAll();
        assertThat(mockActivityEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
