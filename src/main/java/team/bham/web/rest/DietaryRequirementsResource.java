package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.DietaryRequirements;
import team.bham.repository.DietaryRequirementsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DietaryRequirements}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DietaryRequirementsResource {

    private final Logger log = LoggerFactory.getLogger(DietaryRequirementsResource.class);

    private static final String ENTITY_NAME = "dietaryRequirements";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DietaryRequirementsRepository dietaryRequirementsRepository;

    public DietaryRequirementsResource(DietaryRequirementsRepository dietaryRequirementsRepository) {
        this.dietaryRequirementsRepository = dietaryRequirementsRepository;
    }

    /**
     * {@code POST  /dietary-requirements} : Create a new dietaryRequirements.
     *
     * @param dietaryRequirements the dietaryRequirements to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dietaryRequirements, or with status {@code 400 (Bad Request)} if the dietaryRequirements has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dietary-requirements")
    public ResponseEntity<DietaryRequirements> createDietaryRequirements(@RequestBody DietaryRequirements dietaryRequirements)
        throws URISyntaxException {
        log.debug("REST request to save DietaryRequirements : {}", dietaryRequirements);
        if (dietaryRequirements.getId() != null) {
            throw new BadRequestAlertException("A new dietaryRequirements cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DietaryRequirements result = dietaryRequirementsRepository.save(dietaryRequirements);
        return ResponseEntity
            .created(new URI("/api/dietary-requirements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /dietary-requirements/:id} : Updates an existing dietaryRequirements.
     *
     * @param id the id of the dietaryRequirements to save.
     * @param dietaryRequirements the dietaryRequirements to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dietaryRequirements,
     * or with status {@code 400 (Bad Request)} if the dietaryRequirements is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dietaryRequirements couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/dietary-requirements/{id}")
    public ResponseEntity<DietaryRequirements> updateDietaryRequirements(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DietaryRequirements dietaryRequirements
    ) throws URISyntaxException {
        log.debug("REST request to update DietaryRequirements : {}, {}", id, dietaryRequirements);
        if (dietaryRequirements.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dietaryRequirements.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dietaryRequirementsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DietaryRequirements result = dietaryRequirementsRepository.save(dietaryRequirements);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dietaryRequirements.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /dietary-requirements/:id} : Partial updates given fields of an existing dietaryRequirements, field will ignore if it is null
     *
     * @param id the id of the dietaryRequirements to save.
     * @param dietaryRequirements the dietaryRequirements to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dietaryRequirements,
     * or with status {@code 400 (Bad Request)} if the dietaryRequirements is not valid,
     * or with status {@code 404 (Not Found)} if the dietaryRequirements is not found,
     * or with status {@code 500 (Internal Server Error)} if the dietaryRequirements couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/dietary-requirements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DietaryRequirements> partialUpdateDietaryRequirements(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DietaryRequirements dietaryRequirements
    ) throws URISyntaxException {
        log.debug("REST request to partial update DietaryRequirements partially : {}, {}", id, dietaryRequirements);
        if (dietaryRequirements.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dietaryRequirements.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dietaryRequirementsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DietaryRequirements> result = dietaryRequirementsRepository
            .findById(dietaryRequirements.getId())
            .map(existingDietaryRequirements -> {
                if (dietaryRequirements.getOption() != null) {
                    existingDietaryRequirements.setOption(dietaryRequirements.getOption());
                }

                return existingDietaryRequirements;
            })
            .map(dietaryRequirementsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dietaryRequirements.getId().toString())
        );
    }

    /**
     * {@code GET  /dietary-requirements} : get all the dietaryRequirements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dietaryRequirements in body.
     */
    @GetMapping("/dietary-requirements")
    public List<DietaryRequirements> getAllDietaryRequirements() {
        log.debug("REST request to get all DietaryRequirements");
        return dietaryRequirementsRepository.findAll();
    }

    /**
     * {@code GET  /dietary-requirements/:id} : get the "id" dietaryRequirements.
     *
     * @param id the id of the dietaryRequirements to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dietaryRequirements, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dietary-requirements/{id}")
    public ResponseEntity<DietaryRequirements> getDietaryRequirements(@PathVariable Long id) {
        log.debug("REST request to get DietaryRequirements : {}", id);
        Optional<DietaryRequirements> dietaryRequirements = dietaryRequirementsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dietaryRequirements);
    }

    /**
     * {@code DELETE  /dietary-requirements/:id} : delete the "id" dietaryRequirements.
     *
     * @param id the id of the dietaryRequirements to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dietary-requirements/{id}")
    public ResponseEntity<Void> deleteDietaryRequirements(@PathVariable Long id) {
        log.debug("REST request to delete DietaryRequirements : {}", id);
        dietaryRequirementsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
