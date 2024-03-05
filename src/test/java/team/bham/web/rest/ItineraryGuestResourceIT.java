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
import team.bham.domain.ItineraryGuest;
import team.bham.repository.ItineraryGuestRepository;

/**
 * Integration tests for the {@link ItineraryGuestResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ItineraryGuestResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_RSVP_STATUS = false;
    private static final Boolean UPDATED_RSVP_STATUS = true;

    private static final String ENTITY_API_URL = "/api/itinerary-guests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItineraryGuestRepository itineraryGuestRepository;

    @Mock
    private ItineraryGuestRepository itineraryGuestRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItineraryGuestMockMvc;

    private ItineraryGuest itineraryGuest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryGuest createEntity(EntityManager em) {
        ItineraryGuest itineraryGuest = new ItineraryGuest().name(DEFAULT_NAME).email(DEFAULT_EMAIL).rsvpStatus(DEFAULT_RSVP_STATUS);
        return itineraryGuest;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItineraryGuest createUpdatedEntity(EntityManager em) {
        ItineraryGuest itineraryGuest = new ItineraryGuest().name(UPDATED_NAME).email(UPDATED_EMAIL).rsvpStatus(UPDATED_RSVP_STATUS);
        return itineraryGuest;
    }

    @BeforeEach
    public void initTest() {
        itineraryGuest = createEntity(em);
    }

    @Test
    @Transactional
    void createItineraryGuest() throws Exception {
        int databaseSizeBeforeCreate = itineraryGuestRepository.findAll().size();
        // Create the ItineraryGuest
        restItineraryGuestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryGuest))
            )
            .andExpect(status().isCreated());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeCreate + 1);
        ItineraryGuest testItineraryGuest = itineraryGuestList.get(itineraryGuestList.size() - 1);
        assertThat(testItineraryGuest.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testItineraryGuest.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testItineraryGuest.getRsvpStatus()).isEqualTo(DEFAULT_RSVP_STATUS);
    }

    @Test
    @Transactional
    void createItineraryGuestWithExistingId() throws Exception {
        // Create the ItineraryGuest with an existing ID
        itineraryGuest.setId(1L);

        int databaseSizeBeforeCreate = itineraryGuestRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItineraryGuestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryGuest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItineraryGuests() throws Exception {
        // Initialize the database
        itineraryGuestRepository.saveAndFlush(itineraryGuest);

        // Get all the itineraryGuestList
        restItineraryGuestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itineraryGuest.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].rsvpStatus").value(hasItem(DEFAULT_RSVP_STATUS.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllItineraryGuestsWithEagerRelationshipsIsEnabled() throws Exception {
        when(itineraryGuestRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restItineraryGuestMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(itineraryGuestRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllItineraryGuestsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(itineraryGuestRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restItineraryGuestMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(itineraryGuestRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getItineraryGuest() throws Exception {
        // Initialize the database
        itineraryGuestRepository.saveAndFlush(itineraryGuest);

        // Get the itineraryGuest
        restItineraryGuestMockMvc
            .perform(get(ENTITY_API_URL_ID, itineraryGuest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itineraryGuest.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.rsvpStatus").value(DEFAULT_RSVP_STATUS.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingItineraryGuest() throws Exception {
        // Get the itineraryGuest
        restItineraryGuestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItineraryGuest() throws Exception {
        // Initialize the database
        itineraryGuestRepository.saveAndFlush(itineraryGuest);

        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();

        // Update the itineraryGuest
        ItineraryGuest updatedItineraryGuest = itineraryGuestRepository.findById(itineraryGuest.getId()).get();
        // Disconnect from session so that the updates on updatedItineraryGuest are not directly saved in db
        em.detach(updatedItineraryGuest);
        updatedItineraryGuest.name(UPDATED_NAME).email(UPDATED_EMAIL).rsvpStatus(UPDATED_RSVP_STATUS);

        restItineraryGuestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItineraryGuest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItineraryGuest))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
        ItineraryGuest testItineraryGuest = itineraryGuestList.get(itineraryGuestList.size() - 1);
        assertThat(testItineraryGuest.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testItineraryGuest.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testItineraryGuest.getRsvpStatus()).isEqualTo(UPDATED_RSVP_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingItineraryGuest() throws Exception {
        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();
        itineraryGuest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryGuestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itineraryGuest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryGuest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItineraryGuest() throws Exception {
        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();
        itineraryGuest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryGuestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itineraryGuest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItineraryGuest() throws Exception {
        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();
        itineraryGuest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryGuestMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itineraryGuest)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItineraryGuestWithPatch() throws Exception {
        // Initialize the database
        itineraryGuestRepository.saveAndFlush(itineraryGuest);

        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();

        // Update the itineraryGuest using partial update
        ItineraryGuest partialUpdatedItineraryGuest = new ItineraryGuest();
        partialUpdatedItineraryGuest.setId(itineraryGuest.getId());

        partialUpdatedItineraryGuest.name(UPDATED_NAME).rsvpStatus(UPDATED_RSVP_STATUS);

        restItineraryGuestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryGuest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryGuest))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
        ItineraryGuest testItineraryGuest = itineraryGuestList.get(itineraryGuestList.size() - 1);
        assertThat(testItineraryGuest.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testItineraryGuest.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testItineraryGuest.getRsvpStatus()).isEqualTo(UPDATED_RSVP_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateItineraryGuestWithPatch() throws Exception {
        // Initialize the database
        itineraryGuestRepository.saveAndFlush(itineraryGuest);

        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();

        // Update the itineraryGuest using partial update
        ItineraryGuest partialUpdatedItineraryGuest = new ItineraryGuest();
        partialUpdatedItineraryGuest.setId(itineraryGuest.getId());

        partialUpdatedItineraryGuest.name(UPDATED_NAME).email(UPDATED_EMAIL).rsvpStatus(UPDATED_RSVP_STATUS);

        restItineraryGuestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItineraryGuest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItineraryGuest))
            )
            .andExpect(status().isOk());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
        ItineraryGuest testItineraryGuest = itineraryGuestList.get(itineraryGuestList.size() - 1);
        assertThat(testItineraryGuest.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testItineraryGuest.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testItineraryGuest.getRsvpStatus()).isEqualTo(UPDATED_RSVP_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingItineraryGuest() throws Exception {
        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();
        itineraryGuest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItineraryGuestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itineraryGuest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryGuest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItineraryGuest() throws Exception {
        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();
        itineraryGuest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryGuestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itineraryGuest))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItineraryGuest() throws Exception {
        int databaseSizeBeforeUpdate = itineraryGuestRepository.findAll().size();
        itineraryGuest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItineraryGuestMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itineraryGuest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItineraryGuest in the database
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItineraryGuest() throws Exception {
        // Initialize the database
        itineraryGuestRepository.saveAndFlush(itineraryGuest);

        int databaseSizeBeforeDelete = itineraryGuestRepository.findAll().size();

        // Delete the itineraryGuest
        restItineraryGuestMockMvc
            .perform(delete(ENTITY_API_URL_ID, itineraryGuest.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItineraryGuest> itineraryGuestList = itineraryGuestRepository.findAll();
        assertThat(itineraryGuestList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
