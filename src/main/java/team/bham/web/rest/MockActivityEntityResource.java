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
import team.bham.domain.MockActivityEntity;
import team.bham.repository.MockActivityEntityRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MockActivityEntity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MockActivityEntityResource {

    private final Logger log = LoggerFactory.getLogger(MockActivityEntityResource.class);

    private static final String ENTITY_NAME = "mockActivityEntity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MockActivityEntityRepository mockActivityEntityRepository;

    public MockActivityEntityResource(MockActivityEntityRepository mockActivityEntityRepository) {
        this.mockActivityEntityRepository = mockActivityEntityRepository;
    }

    /**
     * {@code POST  /mock-activity-entities} : Create a new mockActivityEntity.
     *
     * @param mockActivityEntity the mockActivityEntity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mockActivityEntity, or with status {@code 400 (Bad Request)} if the mockActivityEntity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mock-activity-entities")
    public ResponseEntity<MockActivityEntity> createMockActivityEntity(@Valid @RequestBody MockActivityEntity mockActivityEntity)
        throws URISyntaxException {
        log.debug("REST request to save MockActivityEntity : {}", mockActivityEntity);
        if (mockActivityEntity.getId() != null) {
            throw new BadRequestAlertException("A new mockActivityEntity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MockActivityEntity result = mockActivityEntityRepository.save(mockActivityEntity);
        return ResponseEntity
            .created(new URI("/api/mock-activity-entities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mock-activity-entities/:id} : Updates an existing mockActivityEntity.
     *
     * @param id the id of the mockActivityEntity to save.
     * @param mockActivityEntity the mockActivityEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mockActivityEntity,
     * or with status {@code 400 (Bad Request)} if the mockActivityEntity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mockActivityEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mock-activity-entities/{id}")
    public ResponseEntity<MockActivityEntity> updateMockActivityEntity(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MockActivityEntity mockActivityEntity
    ) throws URISyntaxException {
        log.debug("REST request to update MockActivityEntity : {}, {}", id, mockActivityEntity);
        if (mockActivityEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mockActivityEntity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mockActivityEntityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MockActivityEntity result = mockActivityEntityRepository.save(mockActivityEntity);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mockActivityEntity.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mock-activity-entities/:id} : Partial updates given fields of an existing mockActivityEntity, field will ignore if it is null
     *
     * @param id the id of the mockActivityEntity to save.
     * @param mockActivityEntity the mockActivityEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mockActivityEntity,
     * or with status {@code 400 (Bad Request)} if the mockActivityEntity is not valid,
     * or with status {@code 404 (Not Found)} if the mockActivityEntity is not found,
     * or with status {@code 500 (Internal Server Error)} if the mockActivityEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mock-activity-entities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MockActivityEntity> partialUpdateMockActivityEntity(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MockActivityEntity mockActivityEntity
    ) throws URISyntaxException {
        log.debug("REST request to partial update MockActivityEntity partially : {}, {}", id, mockActivityEntity);
        if (mockActivityEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mockActivityEntity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mockActivityEntityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MockActivityEntity> result = mockActivityEntityRepository
            .findById(mockActivityEntity.getId())
            .map(existingMockActivityEntity -> {
                if (mockActivityEntity.getName() != null) {
                    existingMockActivityEntity.setName(mockActivityEntity.getName());
                }
                if (mockActivityEntity.getCompanyName() != null) {
                    existingMockActivityEntity.setCompanyName(mockActivityEntity.getCompanyName());
                }
                if (mockActivityEntity.getRating() != null) {
                    existingMockActivityEntity.setRating(mockActivityEntity.getRating());
                }
                if (mockActivityEntity.getDescription() != null) {
                    existingMockActivityEntity.setDescription(mockActivityEntity.getDescription());
                }
                if (mockActivityEntity.getQuantity() != null) {
                    existingMockActivityEntity.setQuantity(mockActivityEntity.getQuantity());
                }
                if (mockActivityEntity.getContact() != null) {
                    existingMockActivityEntity.setContact(mockActivityEntity.getContact());
                }

                return existingMockActivityEntity;
            })
            .map(mockActivityEntityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mockActivityEntity.getId().toString())
        );
    }

    /**
     * {@code GET  /mock-activity-entities} : get all the mockActivityEntities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mockActivityEntities in body.
     */
    @GetMapping("/mock-activity-entities")
    public List<MockActivityEntity> getAllMockActivityEntities() {
        log.debug("REST request to get all MockActivityEntities");
        return mockActivityEntityRepository.findAll();
    }

    /**
     * {@code GET  /mock-activity-entities/:id} : get the "id" mockActivityEntity.
     *
     * @param id the id of the mockActivityEntity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mockActivityEntity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mock-activity-entities/{id}")
    public ResponseEntity<MockActivityEntity> getMockActivityEntity(@PathVariable Long id) {
        log.debug("REST request to get MockActivityEntity : {}", id);
        Optional<MockActivityEntity> mockActivityEntity = mockActivityEntityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mockActivityEntity);
    }

    /**
     * {@code DELETE  /mock-activity-entities/:id} : delete the "id" mockActivityEntity.
     *
     * @param id the id of the mockActivityEntity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mock-activity-entities/{id}")
    public ResponseEntity<Void> deleteMockActivityEntity(@PathVariable Long id) {
        log.debug("REST request to delete MockActivityEntity : {}", id);
        mockActivityEntityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
