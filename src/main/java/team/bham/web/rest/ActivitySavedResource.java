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
import team.bham.domain.ActivitySaved;
import team.bham.repository.ActivitySavedRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ActivitySaved}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivitySavedResource {

    private final Logger log = LoggerFactory.getLogger(ActivitySavedResource.class);

    private static final String ENTITY_NAME = "activitySaved";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivitySavedRepository activitySavedRepository;

    public ActivitySavedResource(ActivitySavedRepository activitySavedRepository) {
        this.activitySavedRepository = activitySavedRepository;
    }

    /**
     * {@code POST  /activity-saveds} : Create a new activitySaved.
     *
     * @param activitySaved the activitySaved to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activitySaved, or with status {@code 400 (Bad Request)} if the activitySaved has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-saveds")
    public ResponseEntity<ActivitySaved> createActivitySaved(@Valid @RequestBody ActivitySaved activitySaved) throws URISyntaxException {
        log.debug("REST request to save ActivitySaved : {}", activitySaved);
        if (activitySaved.getId() != null) {
            throw new BadRequestAlertException("A new activitySaved cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActivitySaved result = activitySavedRepository.save(activitySaved);
        return ResponseEntity
            .created(new URI("/api/activity-saveds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-saveds/:id} : Updates an existing activitySaved.
     *
     * @param id the id of the activitySaved to save.
     * @param activitySaved the activitySaved to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activitySaved,
     * or with status {@code 400 (Bad Request)} if the activitySaved is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activitySaved couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activity-saveds/{id}")
    public ResponseEntity<ActivitySaved> updateActivitySaved(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ActivitySaved activitySaved
    ) throws URISyntaxException {
        log.debug("REST request to update ActivitySaved : {}, {}", id, activitySaved);
        if (activitySaved.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activitySaved.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activitySavedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActivitySaved result = activitySavedRepository.save(activitySaved);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activitySaved.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /activity-saveds/:id} : Partial updates given fields of an existing activitySaved, field will ignore if it is null
     *
     * @param id the id of the activitySaved to save.
     * @param activitySaved the activitySaved to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activitySaved,
     * or with status {@code 400 (Bad Request)} if the activitySaved is not valid,
     * or with status {@code 404 (Not Found)} if the activitySaved is not found,
     * or with status {@code 500 (Internal Server Error)} if the activitySaved couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activity-saveds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActivitySaved> partialUpdateActivitySaved(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ActivitySaved activitySaved
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActivitySaved partially : {}, {}", id, activitySaved);
        if (activitySaved.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activitySaved.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activitySavedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActivitySaved> result = activitySavedRepository
            .findById(activitySaved.getId())
            .map(existingActivitySaved -> {
                if (activitySaved.getName() != null) {
                    existingActivitySaved.setName(activitySaved.getName());
                }
                if (activitySaved.getDate() != null) {
                    existingActivitySaved.setDate(activitySaved.getDate());
                }
                if (activitySaved.getCompany() != null) {
                    existingActivitySaved.setCompany(activitySaved.getCompany());
                }

                return existingActivitySaved;
            })
            .map(activitySavedRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activitySaved.getId().toString())
        );
    }

    /**
     * {@code GET  /activity-saveds} : get all the activitySaveds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activitySaveds in body.
     */
    @GetMapping("/activity-saveds")
    public List<ActivitySaved> getAllActivitySaveds() {
        log.debug("REST request to get all ActivitySaveds");
        return activitySavedRepository.findAll();
    }

    /**
     * {@code GET  /activity-saveds/:id} : get the "id" activitySaved.
     *
     * @param id the id of the activitySaved to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activitySaved, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-saveds/{id}")
    public ResponseEntity<ActivitySaved> getActivitySaved(@PathVariable Long id) {
        log.debug("REST request to get ActivitySaved : {}", id);
        Optional<ActivitySaved> activitySaved = activitySavedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activitySaved);
    }

    /**
     * {@code DELETE  /activity-saveds/:id} : delete the "id" activitySaved.
     *
     * @param id the id of the activitySaved to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-saveds/{id}")
    public ResponseEntity<Void> deleteActivitySaved(@PathVariable Long id) {
        log.debug("REST request to delete ActivitySaved : {}", id);
        activitySavedRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
