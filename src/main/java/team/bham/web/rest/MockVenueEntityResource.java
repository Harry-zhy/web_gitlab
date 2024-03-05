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
import team.bham.domain.MockVenueEntity;
import team.bham.repository.MockVenueEntityRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MockVenueEntity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MockVenueEntityResource {

    private final Logger log = LoggerFactory.getLogger(MockVenueEntityResource.class);

    private static final String ENTITY_NAME = "mockVenueEntity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MockVenueEntityRepository mockVenueEntityRepository;

    public MockVenueEntityResource(MockVenueEntityRepository mockVenueEntityRepository) {
        this.mockVenueEntityRepository = mockVenueEntityRepository;
    }

    /**
     * {@code POST  /mock-venue-entities} : Create a new mockVenueEntity.
     *
     * @param mockVenueEntity the mockVenueEntity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mockVenueEntity, or with status {@code 400 (Bad Request)} if the mockVenueEntity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mock-venue-entities")
    public ResponseEntity<MockVenueEntity> createMockVenueEntity(@Valid @RequestBody MockVenueEntity mockVenueEntity)
        throws URISyntaxException {
        log.debug("REST request to save MockVenueEntity : {}", mockVenueEntity);
        if (mockVenueEntity.getId() != null) {
            throw new BadRequestAlertException("A new mockVenueEntity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MockVenueEntity result = mockVenueEntityRepository.save(mockVenueEntity);
        return ResponseEntity
            .created(new URI("/api/mock-venue-entities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mock-venue-entities/:id} : Updates an existing mockVenueEntity.
     *
     * @param id the id of the mockVenueEntity to save.
     * @param mockVenueEntity the mockVenueEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mockVenueEntity,
     * or with status {@code 400 (Bad Request)} if the mockVenueEntity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mockVenueEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mock-venue-entities/{id}")
    public ResponseEntity<MockVenueEntity> updateMockVenueEntity(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MockVenueEntity mockVenueEntity
    ) throws URISyntaxException {
        log.debug("REST request to update MockVenueEntity : {}, {}", id, mockVenueEntity);
        if (mockVenueEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mockVenueEntity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mockVenueEntityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MockVenueEntity result = mockVenueEntityRepository.save(mockVenueEntity);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mockVenueEntity.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mock-venue-entities/:id} : Partial updates given fields of an existing mockVenueEntity, field will ignore if it is null
     *
     * @param id the id of the mockVenueEntity to save.
     * @param mockVenueEntity the mockVenueEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mockVenueEntity,
     * or with status {@code 400 (Bad Request)} if the mockVenueEntity is not valid,
     * or with status {@code 404 (Not Found)} if the mockVenueEntity is not found,
     * or with status {@code 500 (Internal Server Error)} if the mockVenueEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mock-venue-entities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MockVenueEntity> partialUpdateMockVenueEntity(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MockVenueEntity mockVenueEntity
    ) throws URISyntaxException {
        log.debug("REST request to partial update MockVenueEntity partially : {}, {}", id, mockVenueEntity);
        if (mockVenueEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mockVenueEntity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mockVenueEntityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MockVenueEntity> result = mockVenueEntityRepository
            .findById(mockVenueEntity.getId())
            .map(existingMockVenueEntity -> {
                if (mockVenueEntity.getName() != null) {
                    existingMockVenueEntity.setName(mockVenueEntity.getName());
                }
                if (mockVenueEntity.getCompanyName() != null) {
                    existingMockVenueEntity.setCompanyName(mockVenueEntity.getCompanyName());
                }
                if (mockVenueEntity.getLocation() != null) {
                    existingMockVenueEntity.setLocation(mockVenueEntity.getLocation());
                }
                if (mockVenueEntity.getRating() != null) {
                    existingMockVenueEntity.setRating(mockVenueEntity.getRating());
                }
                if (mockVenueEntity.getDescription() != null) {
                    existingMockVenueEntity.setDescription(mockVenueEntity.getDescription());
                }
                if (mockVenueEntity.getContact() != null) {
                    existingMockVenueEntity.setContact(mockVenueEntity.getContact());
                }

                return existingMockVenueEntity;
            })
            .map(mockVenueEntityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mockVenueEntity.getId().toString())
        );
    }

    /**
     * {@code GET  /mock-venue-entities} : get all the mockVenueEntities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mockVenueEntities in body.
     */
    @GetMapping("/mock-venue-entities")
    public List<MockVenueEntity> getAllMockVenueEntities() {
        log.debug("REST request to get all MockVenueEntities");
        return mockVenueEntityRepository.findAll();
    }

    /**
     * {@code GET  /mock-venue-entities/:id} : get the "id" mockVenueEntity.
     *
     * @param id the id of the mockVenueEntity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mockVenueEntity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mock-venue-entities/{id}")
    public ResponseEntity<MockVenueEntity> getMockVenueEntity(@PathVariable Long id) {
        log.debug("REST request to get MockVenueEntity : {}", id);
        Optional<MockVenueEntity> mockVenueEntity = mockVenueEntityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mockVenueEntity);
    }

    /**
     * {@code DELETE  /mock-venue-entities/:id} : delete the "id" mockVenueEntity.
     *
     * @param id the id of the mockVenueEntity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mock-venue-entities/{id}")
    public ResponseEntity<Void> deleteMockVenueEntity(@PathVariable Long id) {
        log.debug("REST request to delete MockVenueEntity : {}", id);
        mockVenueEntityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
