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
import team.bham.domain.Intro;
import team.bham.repository.IntroRepository;

/**
 * Integration tests for the {@link IntroResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IntroResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SALUTATION = "AAAAAAAAAA";
    private static final String UPDATED_SALUTATION = "BBBBBBBBBB";

    private static final String DEFAULT_BODY = "AAAAAAAAAA";
    private static final String UPDATED_BODY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/intros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IntroRepository introRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIntroMockMvc;

    private Intro intro;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Intro createEntity(EntityManager em) {
        Intro intro = new Intro().title(DEFAULT_TITLE).salutation(DEFAULT_SALUTATION).body(DEFAULT_BODY);
        return intro;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Intro createUpdatedEntity(EntityManager em) {
        Intro intro = new Intro().title(UPDATED_TITLE).salutation(UPDATED_SALUTATION).body(UPDATED_BODY);
        return intro;
    }

    @BeforeEach
    public void initTest() {
        intro = createEntity(em);
    }

    @Test
    @Transactional
    void createIntro() throws Exception {
        int databaseSizeBeforeCreate = introRepository.findAll().size();
        // Create the Intro
        restIntroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(intro)))
            .andExpect(status().isCreated());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeCreate + 1);
        Intro testIntro = introList.get(introList.size() - 1);
        assertThat(testIntro.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testIntro.getSalutation()).isEqualTo(DEFAULT_SALUTATION);
        assertThat(testIntro.getBody()).isEqualTo(DEFAULT_BODY);
    }

    @Test
    @Transactional
    void createIntroWithExistingId() throws Exception {
        // Create the Intro with an existing ID
        intro.setId(1L);

        int databaseSizeBeforeCreate = introRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIntroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(intro)))
            .andExpect(status().isBadRequest());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = introRepository.findAll().size();
        // set the field null
        intro.setTitle(null);

        // Create the Intro, which fails.

        restIntroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(intro)))
            .andExpect(status().isBadRequest());

        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSalutationIsRequired() throws Exception {
        int databaseSizeBeforeTest = introRepository.findAll().size();
        // set the field null
        intro.setSalutation(null);

        // Create the Intro, which fails.

        restIntroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(intro)))
            .andExpect(status().isBadRequest());

        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBodyIsRequired() throws Exception {
        int databaseSizeBeforeTest = introRepository.findAll().size();
        // set the field null
        intro.setBody(null);

        // Create the Intro, which fails.

        restIntroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(intro)))
            .andExpect(status().isBadRequest());

        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIntros() throws Exception {
        // Initialize the database
        introRepository.saveAndFlush(intro);

        // Get all the introList
        restIntroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(intro.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].salutation").value(hasItem(DEFAULT_SALUTATION)))
            .andExpect(jsonPath("$.[*].body").value(hasItem(DEFAULT_BODY)));
    }

    @Test
    @Transactional
    void getIntro() throws Exception {
        // Initialize the database
        introRepository.saveAndFlush(intro);

        // Get the intro
        restIntroMockMvc
            .perform(get(ENTITY_API_URL_ID, intro.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(intro.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.salutation").value(DEFAULT_SALUTATION))
            .andExpect(jsonPath("$.body").value(DEFAULT_BODY));
    }

    @Test
    @Transactional
    void getNonExistingIntro() throws Exception {
        // Get the intro
        restIntroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingIntro() throws Exception {
        // Initialize the database
        introRepository.saveAndFlush(intro);

        int databaseSizeBeforeUpdate = introRepository.findAll().size();

        // Update the intro
        Intro updatedIntro = introRepository.findById(intro.getId()).get();
        // Disconnect from session so that the updates on updatedIntro are not directly saved in db
        em.detach(updatedIntro);
        updatedIntro.title(UPDATED_TITLE).salutation(UPDATED_SALUTATION).body(UPDATED_BODY);

        restIntroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIntro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIntro))
            )
            .andExpect(status().isOk());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
        Intro testIntro = introList.get(introList.size() - 1);
        assertThat(testIntro.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testIntro.getSalutation()).isEqualTo(UPDATED_SALUTATION);
        assertThat(testIntro.getBody()).isEqualTo(UPDATED_BODY);
    }

    @Test
    @Transactional
    void putNonExistingIntro() throws Exception {
        int databaseSizeBeforeUpdate = introRepository.findAll().size();
        intro.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIntroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, intro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(intro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIntro() throws Exception {
        int databaseSizeBeforeUpdate = introRepository.findAll().size();
        intro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIntroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(intro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIntro() throws Exception {
        int databaseSizeBeforeUpdate = introRepository.findAll().size();
        intro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIntroMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(intro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIntroWithPatch() throws Exception {
        // Initialize the database
        introRepository.saveAndFlush(intro);

        int databaseSizeBeforeUpdate = introRepository.findAll().size();

        // Update the intro using partial update
        Intro partialUpdatedIntro = new Intro();
        partialUpdatedIntro.setId(intro.getId());

        partialUpdatedIntro.title(UPDATED_TITLE).salutation(UPDATED_SALUTATION);

        restIntroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIntro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIntro))
            )
            .andExpect(status().isOk());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
        Intro testIntro = introList.get(introList.size() - 1);
        assertThat(testIntro.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testIntro.getSalutation()).isEqualTo(UPDATED_SALUTATION);
        assertThat(testIntro.getBody()).isEqualTo(DEFAULT_BODY);
    }

    @Test
    @Transactional
    void fullUpdateIntroWithPatch() throws Exception {
        // Initialize the database
        introRepository.saveAndFlush(intro);

        int databaseSizeBeforeUpdate = introRepository.findAll().size();

        // Update the intro using partial update
        Intro partialUpdatedIntro = new Intro();
        partialUpdatedIntro.setId(intro.getId());

        partialUpdatedIntro.title(UPDATED_TITLE).salutation(UPDATED_SALUTATION).body(UPDATED_BODY);

        restIntroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIntro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIntro))
            )
            .andExpect(status().isOk());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
        Intro testIntro = introList.get(introList.size() - 1);
        assertThat(testIntro.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testIntro.getSalutation()).isEqualTo(UPDATED_SALUTATION);
        assertThat(testIntro.getBody()).isEqualTo(UPDATED_BODY);
    }

    @Test
    @Transactional
    void patchNonExistingIntro() throws Exception {
        int databaseSizeBeforeUpdate = introRepository.findAll().size();
        intro.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIntroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, intro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(intro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIntro() throws Exception {
        int databaseSizeBeforeUpdate = introRepository.findAll().size();
        intro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIntroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(intro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIntro() throws Exception {
        int databaseSizeBeforeUpdate = introRepository.findAll().size();
        intro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIntroMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(intro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Intro in the database
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIntro() throws Exception {
        // Initialize the database
        introRepository.saveAndFlush(intro);

        int databaseSizeBeforeDelete = introRepository.findAll().size();

        // Delete the intro
        restIntroMockMvc
            .perform(delete(ENTITY_API_URL_ID, intro.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Intro> introList = introRepository.findAll();
        assertThat(introList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
