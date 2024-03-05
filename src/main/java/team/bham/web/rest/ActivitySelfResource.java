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
import team.bham.domain.ActivitySelf;
import team.bham.repository.ActivitySelfRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ActivitySelf}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivitySelfResource {

    private final Logger log = LoggerFactory.getLogger(ActivitySelfResource.class);

    private static final String ENTITY_NAME = "activitySelf";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivitySelfRepository activitySelfRepository;

    public ActivitySelfResource(ActivitySelfRepository activitySelfRepository) {
        this.activitySelfRepository = activitySelfRepository;
    }

    /**
     * {@code POST  /activity-selves} : Create a new activitySelf.
     *
     * @param activitySelf the activitySelf to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activitySelf, or with status {@code 400 (Bad Request)} if the activitySelf has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-selves")
    public ResponseEntity<ActivitySelf> createActivitySelf(@Valid @RequestBody ActivitySelf activitySelf) throws URISyntaxException {
        log.debug("REST request to save ActivitySelf : {}", activitySelf);
        if (activitySelf.getId() != null) {
            throw new BadRequestAlertException("A new activitySelf cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActivitySelf result = activitySelfRepository.save(activitySelf);
        return ResponseEntity
            .created(new URI("/api/activity-selves/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-selves/:id} : Updates an existing activitySelf.
     *
     * @param id the id of the activitySelf to save.
     * @param activitySelf the activitySelf to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activitySelf,
     * or with status {@code 400 (Bad Request)} if the activitySelf is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activitySelf couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activity-selves/{id}")
    public ResponseEntity<ActivitySelf> updateActivitySelf(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ActivitySelf activitySelf
    ) throws URISyntaxException {
        log.debug("REST request to update ActivitySelf : {}, {}", id, activitySelf);
        if (activitySelf.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activitySelf.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activitySelfRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActivitySelf result = activitySelfRepository.save(activitySelf);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activitySelf.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /activity-selves/:id} : Partial updates given fields of an existing activitySelf, field will ignore if it is null
     *
     * @param id the id of the activitySelf to save.
     * @param activitySelf the activitySelf to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activitySelf,
     * or with status {@code 400 (Bad Request)} if the activitySelf is not valid,
     * or with status {@code 404 (Not Found)} if the activitySelf is not found,
     * or with status {@code 500 (Internal Server Error)} if the activitySelf couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activity-selves/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActivitySelf> partialUpdateActivitySelf(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ActivitySelf activitySelf
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActivitySelf partially : {}, {}", id, activitySelf);
        if (activitySelf.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activitySelf.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activitySelfRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActivitySelf> result = activitySelfRepository
            .findById(activitySelf.getId())
            .map(existingActivitySelf -> {
                if (activitySelf.getName() != null) {
                    existingActivitySelf.setName(activitySelf.getName());
                }
                if (activitySelf.getDescription() != null) {
                    existingActivitySelf.setDescription(activitySelf.getDescription());
                }

                return existingActivitySelf;
            })
            .map(activitySelfRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activitySelf.getId().toString())
        );
    }

    /**
     * {@code GET  /activity-selves} : get all the activitySelves.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activitySelves in body.
     */
    @GetMapping("/activity-selves")
    public List<ActivitySelf> getAllActivitySelves(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ActivitySelves");
        if (eagerload) {
            return activitySelfRepository.findAllWithEagerRelationships();
        } else {
            return activitySelfRepository.findAll();
        }
    }

    /**
     * {@code GET  /activity-selves/:id} : get the "id" activitySelf.
     *
     * @param id the id of the activitySelf to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activitySelf, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-selves/{id}")
    public ResponseEntity<ActivitySelf> getActivitySelf(@PathVariable Long id) {
        log.debug("REST request to get ActivitySelf : {}", id);
        Optional<ActivitySelf> activitySelf = activitySelfRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(activitySelf);
    }

    /**
     * {@code DELETE  /activity-selves/:id} : delete the "id" activitySelf.
     *
     * @param id the id of the activitySelf to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-selves/{id}")
    public ResponseEntity<Void> deleteActivitySelf(@PathVariable Long id) {
        log.debug("REST request to delete ActivitySelf : {}", id);
        activitySelfRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
