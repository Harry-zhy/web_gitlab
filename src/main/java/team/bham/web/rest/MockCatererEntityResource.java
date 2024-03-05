package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.MockCatererEntity;
import team.bham.repository.MockCatererEntityRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MockCatererEntity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MockCatererEntityResource {

    private final Logger log = LoggerFactory.getLogger(MockCatererEntityResource.class);

    private static final String ENTITY_NAME = "mockCatererEntity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MockCatererEntityRepository mockCatererEntityRepository;

    public MockCatererEntityResource(MockCatererEntityRepository mockCatererEntityRepository) {
        this.mockCatererEntityRepository = mockCatererEntityRepository;
    }

    /**
     * {@code POST  /mock-caterer-entities} : Create a new mockCatererEntity.
     *
     * @param mockCatererEntity the mockCatererEntity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mockCatererEntity, or with status {@code 400 (Bad Request)} if the mockCatererEntity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mock-caterer-entities")
    public ResponseEntity<MockCatererEntity> createMockCatererEntity(@Valid @RequestBody MockCatererEntity mockCatererEntity)
        throws URISyntaxException {
        log.debug("REST request to save MockCatererEntity : {}", mockCatererEntity);
        if (mockCatererEntity.getId() != null) {
            throw new BadRequestAlertException("A new mockCatererEntity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MockCatererEntity result = mockCatererEntityRepository.save(mockCatererEntity);
        return ResponseEntity
            .created(new URI("/api/mock-caterer-entities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mock-caterer-entities/:id} : Updates an existing mockCatererEntity.
     *
     * @param id the id of the mockCatererEntity to save.
     * @param mockCatererEntity the mockCatererEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mockCatererEntity,
     * or with status {@code 400 (Bad Request)} if the mockCatererEntity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mockCatererEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mock-caterer-entities/{id}")
    public ResponseEntity<MockCatererEntity> updateMockCatererEntity(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MockCatererEntity mockCatererEntity
    ) throws URISyntaxException {
        log.debug("REST request to update MockCatererEntity : {}, {}", id, mockCatererEntity);
        if (mockCatererEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mockCatererEntity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mockCatererEntityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MockCatererEntity result = mockCatererEntityRepository.save(mockCatererEntity);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mockCatererEntity.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mock-caterer-entities/:id} : Partial updates given fields of an existing mockCatererEntity, field will ignore if it is null
     *
     * @param id the id of the mockCatererEntity to save.
     * @param mockCatererEntity the mockCatererEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mockCatererEntity,
     * or with status {@code 400 (Bad Request)} if the mockCatererEntity is not valid,
     * or with status {@code 404 (Not Found)} if the mockCatererEntity is not found,
     * or with status {@code 500 (Internal Server Error)} if the mockCatererEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mock-caterer-entities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MockCatererEntity> partialUpdateMockCatererEntity(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MockCatererEntity mockCatererEntity
    ) throws URISyntaxException {
        log.debug("REST request to partial update MockCatererEntity partially : {}, {}", id, mockCatererEntity);
        if (mockCatererEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mockCatererEntity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mockCatererEntityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MockCatererEntity> result = mockCatererEntityRepository
            .findById(mockCatererEntity.getId())
            .map(existingMockCatererEntity -> {
                if (mockCatererEntity.getName() != null) {
                    existingMockCatererEntity.setName(mockCatererEntity.getName());
                }
                if (mockCatererEntity.getCuisine() != null) {
                    existingMockCatererEntity.setCuisine(mockCatererEntity.getCuisine());
                }
                if (mockCatererEntity.getRating() != null) {
                    existingMockCatererEntity.setRating(mockCatererEntity.getRating());
                }
                if (mockCatererEntity.getDescription() != null) {
                    existingMockCatererEntity.setDescription(mockCatererEntity.getDescription());
                }
                if (mockCatererEntity.getQuantity() != null) {
                    existingMockCatererEntity.setQuantity(mockCatererEntity.getQuantity());
                }
                if (mockCatererEntity.getContact() != null) {
                    existingMockCatererEntity.setContact(mockCatererEntity.getContact());
                }

                return existingMockCatererEntity;
            })
            .map(mockCatererEntityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mockCatererEntity.getId().toString())
        );
    }

    /**
     * {@code GET  /mock-caterer-entities} : get all the mockCatererEntities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mockCatererEntities in body.
     */
    @GetMapping("/mock-caterer-entities")
    public List<MockCatererEntity> getAllMockCatererEntities() {
        log.debug("REST request to get all MockCatererEntities");
        return mockCatererEntityRepository.findAll();
    }

    /**
     * {@code GET  /mock-caterer-entities/:id} : get the "id" mockCatererEntity.
     *
     * @param id the id of the mockCatererEntity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mockCatererEntity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mock-caterer-entities/{id}")
    public ResponseEntity<MockCatererEntity> getMockCatererEntity(@PathVariable Long id) {
        log.debug("REST request to get MockCatererEntity : {}", id);
        Optional<MockCatererEntity> mockCatererEntity = mockCatererEntityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mockCatererEntity);
    }

    /**
     * {@code DELETE  /mock-caterer-entities/:id} : delete the "id" mockCatererEntity.
     *
     * @param id the id of the mockCatererEntity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mock-caterer-entities/{id}")
    public ResponseEntity<Void> deleteMockCatererEntity(@PathVariable Long id) {
        log.debug("REST request to delete MockCatererEntity : {}", id);
        mockCatererEntityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
