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
import team.bham.domain.ActivityIdea;
import team.bham.repository.ActivityIdeaRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ActivityIdea}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivityIdeaResource {

    private final Logger log = LoggerFactory.getLogger(ActivityIdeaResource.class);

    private static final String ENTITY_NAME = "activityIdea";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivityIdeaRepository activityIdeaRepository;

    public ActivityIdeaResource(ActivityIdeaRepository activityIdeaRepository) {
        this.activityIdeaRepository = activityIdeaRepository;
    }

    /**
     * {@code POST  /activity-ideas} : Create a new activityIdea.
     *
     * @param activityIdea the activityIdea to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activityIdea, or with status {@code 400 (Bad Request)} if the activityIdea has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-ideas")
    public ResponseEntity<ActivityIdea> createActivityIdea(@Valid @RequestBody ActivityIdea activityIdea) throws URISyntaxException {
        log.debug("REST request to save ActivityIdea : {}", activityIdea);
        if (activityIdea.getId() != null) {
            throw new BadRequestAlertException("A new activityIdea cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActivityIdea result = activityIdeaRepository.save(activityIdea);
        return ResponseEntity
            .created(new URI("/api/activity-ideas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-ideas/:id} : Updates an existing activityIdea.
     *
     * @param id the id of the activityIdea to save.
     * @param activityIdea the activityIdea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityIdea,
     * or with status {@code 400 (Bad Request)} if the activityIdea is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activityIdea couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activity-ideas/{id}")
    public ResponseEntity<ActivityIdea> updateActivityIdea(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ActivityIdea activityIdea
    ) throws URISyntaxException {
        log.debug("REST request to update ActivityIdea : {}, {}", id, activityIdea);
        if (activityIdea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityIdea.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityIdeaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActivityIdea result = activityIdeaRepository.save(activityIdea);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityIdea.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /activity-ideas/:id} : Partial updates given fields of an existing activityIdea, field will ignore if it is null
     *
     * @param id the id of the activityIdea to save.
     * @param activityIdea the activityIdea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityIdea,
     * or with status {@code 400 (Bad Request)} if the activityIdea is not valid,
     * or with status {@code 404 (Not Found)} if the activityIdea is not found,
     * or with status {@code 500 (Internal Server Error)} if the activityIdea couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activity-ideas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActivityIdea> partialUpdateActivityIdea(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ActivityIdea activityIdea
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActivityIdea partially : {}, {}", id, activityIdea);
        if (activityIdea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityIdea.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityIdeaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActivityIdea> result = activityIdeaRepository
            .findById(activityIdea.getId())
            .map(existingActivityIdea -> {
                if (activityIdea.getDescription() != null) {
                    existingActivityIdea.setDescription(activityIdea.getDescription());
                }
                if (activityIdea.getLink() != null) {
                    existingActivityIdea.setLink(activityIdea.getLink());
                }

                return existingActivityIdea;
            })
            .map(activityIdeaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityIdea.getId().toString())
        );
    }

    /**
     * {@code GET  /activity-ideas} : get all the activityIdeas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activityIdeas in body.
     */
    @GetMapping("/activity-ideas")
    public List<ActivityIdea> getAllActivityIdeas() {
        log.debug("REST request to get all ActivityIdeas");
        return activityIdeaRepository.findAll();
    }

    /**
     * {@code GET  /activity-ideas/:id} : get the "id" activityIdea.
     *
     * @param id the id of the activityIdea to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activityIdea, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-ideas/{id}")
    public ResponseEntity<ActivityIdea> getActivityIdea(@PathVariable Long id) {
        log.debug("REST request to get ActivityIdea : {}", id);
        Optional<ActivityIdea> activityIdea = activityIdeaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activityIdea);
    }

    /**
     * {@code DELETE  /activity-ideas/:id} : delete the "id" activityIdea.
     *
     * @param id the id of the activityIdea to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-ideas/{id}")
    public ResponseEntity<Void> deleteActivityIdea(@PathVariable Long id) {
        log.debug("REST request to delete ActivityIdea : {}", id);
        activityIdeaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
