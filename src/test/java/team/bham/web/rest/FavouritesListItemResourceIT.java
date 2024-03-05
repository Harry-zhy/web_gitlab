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
import team.bham.domain.FavouritesListItem;
import team.bham.domain.enumeration.Category;
import team.bham.repository.FavouritesListItemRepository;

/**
 * Integration tests for the {@link FavouritesListItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FavouritesListItemResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Category DEFAULT_CATEGORY = Category.CATERER;
    private static final Category UPDATED_CATEGORY = Category.VENUE;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/favourites-list-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FavouritesListItemRepository favouritesListItemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFavouritesListItemMockMvc;

    private FavouritesListItem favouritesListItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FavouritesListItem createEntity(EntityManager em) {
        FavouritesListItem favouritesListItem = new FavouritesListItem()
            .name(DEFAULT_NAME)
            .category(DEFAULT_CATEGORY)
            .description(DEFAULT_DESCRIPTION);
        return favouritesListItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FavouritesListItem createUpdatedEntity(EntityManager em) {
        FavouritesListItem favouritesListItem = new FavouritesListItem()
            .name(UPDATED_NAME)
            .category(UPDATED_CATEGORY)
            .description(UPDATED_DESCRIPTION);
        return favouritesListItem;
    }

    @BeforeEach
    public void initTest() {
        favouritesListItem = createEntity(em);
    }

    @Test
    @Transactional
    void createFavouritesListItem() throws Exception {
        int databaseSizeBeforeCreate = favouritesListItemRepository.findAll().size();
        // Create the FavouritesListItem
        restFavouritesListItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favouritesListItem))
            )
            .andExpect(status().isCreated());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeCreate + 1);
        FavouritesListItem testFavouritesListItem = favouritesListItemList.get(favouritesListItemList.size() - 1);
        assertThat(testFavouritesListItem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFavouritesListItem.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testFavouritesListItem.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createFavouritesListItemWithExistingId() throws Exception {
        // Create the FavouritesListItem with an existing ID
        favouritesListItem.setId(1L);

        int databaseSizeBeforeCreate = favouritesListItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFavouritesListItemMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favouritesListItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFavouritesListItems() throws Exception {
        // Initialize the database
        favouritesListItemRepository.saveAndFlush(favouritesListItem);

        // Get all the favouritesListItemList
        restFavouritesListItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(favouritesListItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getFavouritesListItem() throws Exception {
        // Initialize the database
        favouritesListItemRepository.saveAndFlush(favouritesListItem);

        // Get the favouritesListItem
        restFavouritesListItemMockMvc
            .perform(get(ENTITY_API_URL_ID, favouritesListItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(favouritesListItem.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingFavouritesListItem() throws Exception {
        // Get the favouritesListItem
        restFavouritesListItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFavouritesListItem() throws Exception {
        // Initialize the database
        favouritesListItemRepository.saveAndFlush(favouritesListItem);

        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();

        // Update the favouritesListItem
        FavouritesListItem updatedFavouritesListItem = favouritesListItemRepository.findById(favouritesListItem.getId()).get();
        // Disconnect from session so that the updates on updatedFavouritesListItem are not directly saved in db
        em.detach(updatedFavouritesListItem);
        updatedFavouritesListItem.name(UPDATED_NAME).category(UPDATED_CATEGORY).description(UPDATED_DESCRIPTION);

        restFavouritesListItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFavouritesListItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFavouritesListItem))
            )
            .andExpect(status().isOk());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
        FavouritesListItem testFavouritesListItem = favouritesListItemList.get(favouritesListItemList.size() - 1);
        assertThat(testFavouritesListItem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFavouritesListItem.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testFavouritesListItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingFavouritesListItem() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();
        favouritesListItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFavouritesListItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, favouritesListItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(favouritesListItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFavouritesListItem() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();
        favouritesListItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouritesListItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(favouritesListItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFavouritesListItem() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();
        favouritesListItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouritesListItemMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favouritesListItem))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFavouritesListItemWithPatch() throws Exception {
        // Initialize the database
        favouritesListItemRepository.saveAndFlush(favouritesListItem);

        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();

        // Update the favouritesListItem using partial update
        FavouritesListItem partialUpdatedFavouritesListItem = new FavouritesListItem();
        partialUpdatedFavouritesListItem.setId(favouritesListItem.getId());

        partialUpdatedFavouritesListItem.description(UPDATED_DESCRIPTION);

        restFavouritesListItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFavouritesListItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFavouritesListItem))
            )
            .andExpect(status().isOk());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
        FavouritesListItem testFavouritesListItem = favouritesListItemList.get(favouritesListItemList.size() - 1);
        assertThat(testFavouritesListItem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFavouritesListItem.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testFavouritesListItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateFavouritesListItemWithPatch() throws Exception {
        // Initialize the database
        favouritesListItemRepository.saveAndFlush(favouritesListItem);

        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();

        // Update the favouritesListItem using partial update
        FavouritesListItem partialUpdatedFavouritesListItem = new FavouritesListItem();
        partialUpdatedFavouritesListItem.setId(favouritesListItem.getId());

        partialUpdatedFavouritesListItem.name(UPDATED_NAME).category(UPDATED_CATEGORY).description(UPDATED_DESCRIPTION);

        restFavouritesListItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFavouritesListItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFavouritesListItem))
            )
            .andExpect(status().isOk());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
        FavouritesListItem testFavouritesListItem = favouritesListItemList.get(favouritesListItemList.size() - 1);
        assertThat(testFavouritesListItem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFavouritesListItem.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testFavouritesListItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingFavouritesListItem() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();
        favouritesListItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFavouritesListItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, favouritesListItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(favouritesListItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFavouritesListItem() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();
        favouritesListItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouritesListItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(favouritesListItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFavouritesListItem() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListItemRepository.findAll().size();
        favouritesListItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouritesListItemMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(favouritesListItem))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FavouritesListItem in the database
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFavouritesListItem() throws Exception {
        // Initialize the database
        favouritesListItemRepository.saveAndFlush(favouritesListItem);

        int databaseSizeBeforeDelete = favouritesListItemRepository.findAll().size();

        // Delete the favouritesListItem
        restFavouritesListItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, favouritesListItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FavouritesListItem> favouritesListItemList = favouritesListItemRepository.findAll();
        assertThat(favouritesListItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
