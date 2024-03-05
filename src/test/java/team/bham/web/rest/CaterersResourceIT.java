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
import org.springframework.util.Base64Utils;
import team.bham.IntegrationTest;
import team.bham.domain.Caterers;
import team.bham.repository.CaterersRepository;

/**
 * Integration tests for the {@link CaterersResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CaterersResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final Double DEFAULT_PRICE_PER_PERSON = 1D;
    private static final Double UPDATED_PRICE_PER_PERSON = 2D;

    private static final Integer DEFAULT_GUEST_LIMIT = 1;
    private static final Integer UPDATED_GUEST_LIMIT = 2;

    private static final String ENTITY_API_URL = "/api/caterers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CaterersRepository caterersRepository;

    @Mock
    private CaterersRepository caterersRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCaterersMockMvc;

    private Caterers caterers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caterers createEntity(EntityManager em) {
        Caterers caterers = new Caterers()
            .name(DEFAULT_NAME)
            .picture(DEFAULT_PICTURE)
            .pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE)
            .pricePerPerson(DEFAULT_PRICE_PER_PERSON)
            .guestLimit(DEFAULT_GUEST_LIMIT);
        return caterers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caterers createUpdatedEntity(EntityManager em) {
        Caterers caterers = new Caterers()
            .name(UPDATED_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .pricePerPerson(UPDATED_PRICE_PER_PERSON)
            .guestLimit(UPDATED_GUEST_LIMIT);
        return caterers;
    }

    @BeforeEach
    public void initTest() {
        caterers = createEntity(em);
    }

    @Test
    @Transactional
    void createCaterers() throws Exception {
        int databaseSizeBeforeCreate = caterersRepository.findAll().size();
        // Create the Caterers
        restCaterersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caterers)))
            .andExpect(status().isCreated());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeCreate + 1);
        Caterers testCaterers = caterersList.get(caterersList.size() - 1);
        assertThat(testCaterers.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCaterers.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testCaterers.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
        assertThat(testCaterers.getPricePerPerson()).isEqualTo(DEFAULT_PRICE_PER_PERSON);
        assertThat(testCaterers.getGuestLimit()).isEqualTo(DEFAULT_GUEST_LIMIT);
    }

    @Test
    @Transactional
    void createCaterersWithExistingId() throws Exception {
        // Create the Caterers with an existing ID
        caterers.setId(1L);

        int databaseSizeBeforeCreate = caterersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCaterersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caterers)))
            .andExpect(status().isBadRequest());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCaterers() throws Exception {
        // Initialize the database
        caterersRepository.saveAndFlush(caterers);

        // Get all the caterersList
        restCaterersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(caterers.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))))
            .andExpect(jsonPath("$.[*].pricePerPerson").value(hasItem(DEFAULT_PRICE_PER_PERSON.doubleValue())))
            .andExpect(jsonPath("$.[*].guestLimit").value(hasItem(DEFAULT_GUEST_LIMIT)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCaterersWithEagerRelationshipsIsEnabled() throws Exception {
        when(caterersRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCaterersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(caterersRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCaterersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(caterersRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCaterersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(caterersRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCaterers() throws Exception {
        // Initialize the database
        caterersRepository.saveAndFlush(caterers);

        // Get the caterers
        restCaterersMockMvc
            .perform(get(ENTITY_API_URL_ID, caterers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(caterers.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)))
            .andExpect(jsonPath("$.pricePerPerson").value(DEFAULT_PRICE_PER_PERSON.doubleValue()))
            .andExpect(jsonPath("$.guestLimit").value(DEFAULT_GUEST_LIMIT));
    }

    @Test
    @Transactional
    void getNonExistingCaterers() throws Exception {
        // Get the caterers
        restCaterersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCaterers() throws Exception {
        // Initialize the database
        caterersRepository.saveAndFlush(caterers);

        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();

        // Update the caterers
        Caterers updatedCaterers = caterersRepository.findById(caterers.getId()).get();
        // Disconnect from session so that the updates on updatedCaterers are not directly saved in db
        em.detach(updatedCaterers);
        updatedCaterers
            .name(UPDATED_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .pricePerPerson(UPDATED_PRICE_PER_PERSON)
            .guestLimit(UPDATED_GUEST_LIMIT);

        restCaterersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCaterers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCaterers))
            )
            .andExpect(status().isOk());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
        Caterers testCaterers = caterersList.get(caterersList.size() - 1);
        assertThat(testCaterers.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCaterers.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testCaterers.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
        assertThat(testCaterers.getPricePerPerson()).isEqualTo(UPDATED_PRICE_PER_PERSON);
        assertThat(testCaterers.getGuestLimit()).isEqualTo(UPDATED_GUEST_LIMIT);
    }

    @Test
    @Transactional
    void putNonExistingCaterers() throws Exception {
        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();
        caterers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaterersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, caterers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caterers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCaterers() throws Exception {
        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();
        caterers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaterersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caterers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCaterers() throws Exception {
        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();
        caterers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaterersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caterers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCaterersWithPatch() throws Exception {
        // Initialize the database
        caterersRepository.saveAndFlush(caterers);

        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();

        // Update the caterers using partial update
        Caterers partialUpdatedCaterers = new Caterers();
        partialUpdatedCaterers.setId(caterers.getId());

        partialUpdatedCaterers.name(UPDATED_NAME).guestLimit(UPDATED_GUEST_LIMIT);

        restCaterersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaterers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaterers))
            )
            .andExpect(status().isOk());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
        Caterers testCaterers = caterersList.get(caterersList.size() - 1);
        assertThat(testCaterers.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCaterers.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testCaterers.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
        assertThat(testCaterers.getPricePerPerson()).isEqualTo(DEFAULT_PRICE_PER_PERSON);
        assertThat(testCaterers.getGuestLimit()).isEqualTo(UPDATED_GUEST_LIMIT);
    }

    @Test
    @Transactional
    void fullUpdateCaterersWithPatch() throws Exception {
        // Initialize the database
        caterersRepository.saveAndFlush(caterers);

        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();

        // Update the caterers using partial update
        Caterers partialUpdatedCaterers = new Caterers();
        partialUpdatedCaterers.setId(caterers.getId());

        partialUpdatedCaterers
            .name(UPDATED_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE)
            .pricePerPerson(UPDATED_PRICE_PER_PERSON)
            .guestLimit(UPDATED_GUEST_LIMIT);

        restCaterersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaterers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaterers))
            )
            .andExpect(status().isOk());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
        Caterers testCaterers = caterersList.get(caterersList.size() - 1);
        assertThat(testCaterers.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCaterers.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testCaterers.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
        assertThat(testCaterers.getPricePerPerson()).isEqualTo(UPDATED_PRICE_PER_PERSON);
        assertThat(testCaterers.getGuestLimit()).isEqualTo(UPDATED_GUEST_LIMIT);
    }

    @Test
    @Transactional
    void patchNonExistingCaterers() throws Exception {
        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();
        caterers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaterersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, caterers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caterers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCaterers() throws Exception {
        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();
        caterers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaterersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caterers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCaterers() throws Exception {
        int databaseSizeBeforeUpdate = caterersRepository.findAll().size();
        caterers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaterersMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(caterers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caterers in the database
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCaterers() throws Exception {
        // Initialize the database
        caterersRepository.saveAndFlush(caterers);

        int databaseSizeBeforeDelete = caterersRepository.findAll().size();

        // Delete the caterers
        restCaterersMockMvc
            .perform(delete(ENTITY_API_URL_ID, caterers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Caterers> caterersList = caterersRepository.findAll();
        assertThat(caterersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
