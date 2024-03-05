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
import team.bham.domain.MCQOption;
import team.bham.repository.MCQOptionRepository;

/**
 * Integration tests for the {@link MCQOptionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MCQOptionResourceIT {

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/mcq-options";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MCQOptionRepository mCQOptionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMCQOptionMockMvc;

    private MCQOption mCQOption;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MCQOption createEntity(EntityManager em) {
        MCQOption mCQOption = new MCQOption().value(DEFAULT_VALUE);
        return mCQOption;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MCQOption createUpdatedEntity(EntityManager em) {
        MCQOption mCQOption = new MCQOption().value(UPDATED_VALUE);
        return mCQOption;
    }

    @BeforeEach
    public void initTest() {
        mCQOption = createEntity(em);
    }

    @Test
    @Transactional
    void createMCQOption() throws Exception {
        int databaseSizeBeforeCreate = mCQOptionRepository.findAll().size();
        // Create the MCQOption
        restMCQOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mCQOption)))
            .andExpect(status().isCreated());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeCreate + 1);
        MCQOption testMCQOption = mCQOptionList.get(mCQOptionList.size() - 1);
        assertThat(testMCQOption.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createMCQOptionWithExistingId() throws Exception {
        // Create the MCQOption with an existing ID
        mCQOption.setId(1L);

        int databaseSizeBeforeCreate = mCQOptionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMCQOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mCQOption)))
            .andExpect(status().isBadRequest());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = mCQOptionRepository.findAll().size();
        // set the field null
        mCQOption.setValue(null);

        // Create the MCQOption, which fails.

        restMCQOptionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mCQOption)))
            .andExpect(status().isBadRequest());

        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMCQOptions() throws Exception {
        // Initialize the database
        mCQOptionRepository.saveAndFlush(mCQOption);

        // Get all the mCQOptionList
        restMCQOptionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mCQOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getMCQOption() throws Exception {
        // Initialize the database
        mCQOptionRepository.saveAndFlush(mCQOption);

        // Get the mCQOption
        restMCQOptionMockMvc
            .perform(get(ENTITY_API_URL_ID, mCQOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mCQOption.getId().intValue()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingMCQOption() throws Exception {
        // Get the mCQOption
        restMCQOptionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMCQOption() throws Exception {
        // Initialize the database
        mCQOptionRepository.saveAndFlush(mCQOption);

        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();

        // Update the mCQOption
        MCQOption updatedMCQOption = mCQOptionRepository.findById(mCQOption.getId()).get();
        // Disconnect from session so that the updates on updatedMCQOption are not directly saved in db
        em.detach(updatedMCQOption);
        updatedMCQOption.value(UPDATED_VALUE);

        restMCQOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMCQOption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMCQOption))
            )
            .andExpect(status().isOk());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
        MCQOption testMCQOption = mCQOptionList.get(mCQOptionList.size() - 1);
        assertThat(testMCQOption.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingMCQOption() throws Exception {
        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();
        mCQOption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMCQOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mCQOption.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mCQOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMCQOption() throws Exception {
        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();
        mCQOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMCQOptionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(mCQOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMCQOption() throws Exception {
        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();
        mCQOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMCQOptionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(mCQOption)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMCQOptionWithPatch() throws Exception {
        // Initialize the database
        mCQOptionRepository.saveAndFlush(mCQOption);

        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();

        // Update the mCQOption using partial update
        MCQOption partialUpdatedMCQOption = new MCQOption();
        partialUpdatedMCQOption.setId(mCQOption.getId());

        partialUpdatedMCQOption.value(UPDATED_VALUE);

        restMCQOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMCQOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMCQOption))
            )
            .andExpect(status().isOk());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
        MCQOption testMCQOption = mCQOptionList.get(mCQOptionList.size() - 1);
        assertThat(testMCQOption.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateMCQOptionWithPatch() throws Exception {
        // Initialize the database
        mCQOptionRepository.saveAndFlush(mCQOption);

        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();

        // Update the mCQOption using partial update
        MCQOption partialUpdatedMCQOption = new MCQOption();
        partialUpdatedMCQOption.setId(mCQOption.getId());

        partialUpdatedMCQOption.value(UPDATED_VALUE);

        restMCQOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMCQOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMCQOption))
            )
            .andExpect(status().isOk());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
        MCQOption testMCQOption = mCQOptionList.get(mCQOptionList.size() - 1);
        assertThat(testMCQOption.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingMCQOption() throws Exception {
        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();
        mCQOption.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMCQOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mCQOption.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mCQOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMCQOption() throws Exception {
        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();
        mCQOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMCQOptionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(mCQOption))
            )
            .andExpect(status().isBadRequest());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMCQOption() throws Exception {
        int databaseSizeBeforeUpdate = mCQOptionRepository.findAll().size();
        mCQOption.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMCQOptionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(mCQOption))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MCQOption in the database
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMCQOption() throws Exception {
        // Initialize the database
        mCQOptionRepository.saveAndFlush(mCQOption);

        int databaseSizeBeforeDelete = mCQOptionRepository.findAll().size();

        // Delete the mCQOption
        restMCQOptionMockMvc
            .perform(delete(ENTITY_API_URL_ID, mCQOption.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MCQOption> mCQOptionList = mCQOptionRepository.findAll();
        assertThat(mCQOptionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
