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
import team.bham.domain.FavouritesList;
import team.bham.repository.FavouritesListRepository;

/**
 * Integration tests for the {@link FavouritesListResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FavouritesListResourceIT {

    private static final String ENTITY_API_URL = "/api/favourites-lists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FavouritesListRepository favouritesListRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFavouritesListMockMvc;

    private FavouritesList favouritesList;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FavouritesList createEntity(EntityManager em) {
        FavouritesList favouritesList = new FavouritesList();
        return favouritesList;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FavouritesList createUpdatedEntity(EntityManager em) {
        FavouritesList favouritesList = new FavouritesList();
        return favouritesList;
    }

    @BeforeEach
    public void initTest() {
        favouritesList = createEntity(em);
    }

    @Test
    @Transactional
    void createFavouritesList() throws Exception {
        int databaseSizeBeforeCreate = favouritesListRepository.findAll().size();
        // Create the FavouritesList
        restFavouritesListMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favouritesList))
            )
            .andExpect(status().isCreated());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeCreate + 1);
        FavouritesList testFavouritesList = favouritesListList.get(favouritesListList.size() - 1);
    }

    @Test
    @Transactional
    void createFavouritesListWithExistingId() throws Exception {
        // Create the FavouritesList with an existing ID
        favouritesList.setId(1L);

        int databaseSizeBeforeCreate = favouritesListRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFavouritesListMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favouritesList))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFavouritesLists() throws Exception {
        // Initialize the database
        favouritesListRepository.saveAndFlush(favouritesList);

        // Get all the favouritesListList
        restFavouritesListMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(favouritesList.getId().intValue())));
    }

    @Test
    @Transactional
    void getFavouritesList() throws Exception {
        // Initialize the database
        favouritesListRepository.saveAndFlush(favouritesList);

        // Get the favouritesList
        restFavouritesListMockMvc
            .perform(get(ENTITY_API_URL_ID, favouritesList.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(favouritesList.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingFavouritesList() throws Exception {
        // Get the favouritesList
        restFavouritesListMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFavouritesList() throws Exception {
        // Initialize the database
        favouritesListRepository.saveAndFlush(favouritesList);

        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();

        // Update the favouritesList
        FavouritesList updatedFavouritesList = favouritesListRepository.findById(favouritesList.getId()).get();
        // Disconnect from session so that the updates on updatedFavouritesList are not directly saved in db
        em.detach(updatedFavouritesList);

        restFavouritesListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFavouritesList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFavouritesList))
            )
            .andExpect(status().isOk());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
        FavouritesList testFavouritesList = favouritesListList.get(favouritesListList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingFavouritesList() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();
        favouritesList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFavouritesListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, favouritesList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(favouritesList))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFavouritesList() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();
        favouritesList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouritesListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(favouritesList))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFavouritesList() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();
        favouritesList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouritesListMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(favouritesList)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFavouritesListWithPatch() throws Exception {
        // Initialize the database
        favouritesListRepository.saveAndFlush(favouritesList);

        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();

        // Update the favouritesList using partial update
        FavouritesList partialUpdatedFavouritesList = new FavouritesList();
        partialUpdatedFavouritesList.setId(favouritesList.getId());

        restFavouritesListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFavouritesList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFavouritesList))
            )
            .andExpect(status().isOk());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
        FavouritesList testFavouritesList = favouritesListList.get(favouritesListList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateFavouritesListWithPatch() throws Exception {
        // Initialize the database
        favouritesListRepository.saveAndFlush(favouritesList);

        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();

        // Update the favouritesList using partial update
        FavouritesList partialUpdatedFavouritesList = new FavouritesList();
        partialUpdatedFavouritesList.setId(favouritesList.getId());

        restFavouritesListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFavouritesList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFavouritesList))
            )
            .andExpect(status().isOk());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
        FavouritesList testFavouritesList = favouritesListList.get(favouritesListList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingFavouritesList() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();
        favouritesList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFavouritesListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, favouritesList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(favouritesList))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFavouritesList() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();
        favouritesList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouritesListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(favouritesList))
            )
            .andExpect(status().isBadRequest());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFavouritesList() throws Exception {
        int databaseSizeBeforeUpdate = favouritesListRepository.findAll().size();
        favouritesList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFavouritesListMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(favouritesList))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FavouritesList in the database
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFavouritesList() throws Exception {
        // Initialize the database
        favouritesListRepository.saveAndFlush(favouritesList);

        int databaseSizeBeforeDelete = favouritesListRepository.findAll().size();

        // Delete the favouritesList
        restFavouritesListMockMvc
            .perform(delete(ENTITY_API_URL_ID, favouritesList.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FavouritesList> favouritesListList = favouritesListRepository.findAll();
        assertThat(favouritesListList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
