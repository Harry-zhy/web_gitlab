package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.DecoBudget;
import team.bham.repository.DecoBudgetRepository;

/**
 * Integration tests for the {@link DecoBudgetResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DecoBudgetResourceIT {

    private static final Integer DEFAULT_MONEY = 1;
    private static final Integer UPDATED_MONEY = 2;

    private static final String ENTITY_API_URL = "/api/deco-budgets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DecoBudgetRepository decoBudgetRepository;

    @Mock
    private DecoBudgetRepository decoBudgetRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDecoBudgetMockMvc;

    private DecoBudget decoBudget;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoBudget createEntity(EntityManager em) {
        DecoBudget decoBudget = new DecoBudget().money(DEFAULT_MONEY);
        return decoBudget;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DecoBudget createUpdatedEntity(EntityManager em) {
        DecoBudget decoBudget = new DecoBudget().money(UPDATED_MONEY);
        return decoBudget;
    }

    @BeforeEach
    public void initTest() {
        decoBudget = createEntity(em);
    }

    @Test
    @Transactional
    void createDecoBudget() throws Exception {
        int databaseSizeBeforeCreate = decoBudgetRepository.findAll().size();
        // Create the DecoBudget
        restDecoBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoBudget)))
            .andExpect(status().isCreated());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeCreate + 1);
        DecoBudget testDecoBudget = decoBudgetList.get(decoBudgetList.size() - 1);
        assertThat(testDecoBudget.getMoney()).isEqualTo(DEFAULT_MONEY);
    }

    @Test
    @Transactional
    void createDecoBudgetWithExistingId() throws Exception {
        // Create the DecoBudget with an existing ID
        decoBudget.setId(1L);

        int databaseSizeBeforeCreate = decoBudgetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDecoBudgetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoBudget)))
            .andExpect(status().isBadRequest());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDecoBudgets() throws Exception {
        // Initialize the database
        decoBudgetRepository.saveAndFlush(decoBudget);

        // Get all the decoBudgetList
        restDecoBudgetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(decoBudget.getId().intValue())))
            .andExpect(jsonPath("$.[*].money").value(hasItem(DEFAULT_MONEY)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDecoBudgetsWithEagerRelationshipsIsEnabled() throws Exception {
        when(decoBudgetRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDecoBudgetMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(decoBudgetRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDecoBudgetsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(decoBudgetRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDecoBudgetMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(decoBudgetRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDecoBudget() throws Exception {
        // Initialize the database
        decoBudgetRepository.saveAndFlush(decoBudget);

        // Get the decoBudget
        restDecoBudgetMockMvc
            .perform(get(ENTITY_API_URL_ID, decoBudget.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(decoBudget.getId().intValue()))
            .andExpect(jsonPath("$.money").value(DEFAULT_MONEY));
    }

    @Test
    @Transactional
    void getNonExistingDecoBudget() throws Exception {
        // Get the decoBudget
        restDecoBudgetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDecoBudget() throws Exception {
        // Initialize the database
        decoBudgetRepository.saveAndFlush(decoBudget);

        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();

        // Update the decoBudget
        DecoBudget updatedDecoBudget = decoBudgetRepository.findById(decoBudget.getId()).get();
        // Disconnect from session so that the updates on updatedDecoBudget are not directly saved in db
        em.detach(updatedDecoBudget);
        updatedDecoBudget.money(UPDATED_MONEY);

        restDecoBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDecoBudget.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDecoBudget))
            )
            .andExpect(status().isOk());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
        DecoBudget testDecoBudget = decoBudgetList.get(decoBudgetList.size() - 1);
        assertThat(testDecoBudget.getMoney()).isEqualTo(UPDATED_MONEY);
    }

    @Test
    @Transactional
    void putNonExistingDecoBudget() throws Exception {
        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();
        decoBudget.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, decoBudget.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoBudget))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDecoBudget() throws Exception {
        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();
        decoBudget.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoBudgetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(decoBudget))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDecoBudget() throws Exception {
        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();
        decoBudget.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoBudgetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(decoBudget)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDecoBudgetWithPatch() throws Exception {
        // Initialize the database
        decoBudgetRepository.saveAndFlush(decoBudget);

        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();

        // Update the decoBudget using partial update
        DecoBudget partialUpdatedDecoBudget = new DecoBudget();
        partialUpdatedDecoBudget.setId(decoBudget.getId());

        restDecoBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoBudget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoBudget))
            )
            .andExpect(status().isOk());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
        DecoBudget testDecoBudget = decoBudgetList.get(decoBudgetList.size() - 1);
        assertThat(testDecoBudget.getMoney()).isEqualTo(DEFAULT_MONEY);
    }

    @Test
    @Transactional
    void fullUpdateDecoBudgetWithPatch() throws Exception {
        // Initialize the database
        decoBudgetRepository.saveAndFlush(decoBudget);

        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();

        // Update the decoBudget using partial update
        DecoBudget partialUpdatedDecoBudget = new DecoBudget();
        partialUpdatedDecoBudget.setId(decoBudget.getId());

        partialUpdatedDecoBudget.money(UPDATED_MONEY);

        restDecoBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDecoBudget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDecoBudget))
            )
            .andExpect(status().isOk());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
        DecoBudget testDecoBudget = decoBudgetList.get(decoBudgetList.size() - 1);
        assertThat(testDecoBudget.getMoney()).isEqualTo(UPDATED_MONEY);
    }

    @Test
    @Transactional
    void patchNonExistingDecoBudget() throws Exception {
        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();
        decoBudget.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDecoBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, decoBudget.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoBudget))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDecoBudget() throws Exception {
        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();
        decoBudget.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(decoBudget))
            )
            .andExpect(status().isBadRequest());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDecoBudget() throws Exception {
        int databaseSizeBeforeUpdate = decoBudgetRepository.findAll().size();
        decoBudget.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDecoBudgetMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(decoBudget))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DecoBudget in the database
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDecoBudget() throws Exception {
        // Initialize the database
        decoBudgetRepository.saveAndFlush(decoBudget);

        int databaseSizeBeforeDelete = decoBudgetRepository.findAll().size();

        // Delete the decoBudget
        restDecoBudgetMockMvc
            .perform(delete(ENTITY_API_URL_ID, decoBudget.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DecoBudget> decoBudgetList = decoBudgetRepository.findAll();
        assertThat(decoBudgetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
