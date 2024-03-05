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
import team.bham.domain.Feedbacks;
import team.bham.repository.FeedbacksRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Feedbacks}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FeedbacksResource {

    private final Logger log = LoggerFactory.getLogger(FeedbacksResource.class);

    private static final String ENTITY_NAME = "feedbacks";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FeedbacksRepository feedbacksRepository;

    public FeedbacksResource(FeedbacksRepository feedbacksRepository) {
        this.feedbacksRepository = feedbacksRepository;
    }

    /**
     * {@code POST  /feedbacks} : Create a new feedbacks.
     *
     * @param feedbacks the feedbacks to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new feedbacks, or with status {@code 400 (Bad Request)} if the feedbacks has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/feedbacks")
    public ResponseEntity<Feedbacks> createFeedbacks(@Valid @RequestBody Feedbacks feedbacks) throws URISyntaxException {
        log.debug("REST request to save Feedbacks : {}", feedbacks);
        if (feedbacks.getId() != null) {
            throw new BadRequestAlertException("A new feedbacks cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Feedbacks result = feedbacksRepository.save(feedbacks);
        return ResponseEntity
            .created(new URI("/api/feedbacks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /feedbacks/:id} : Updates an existing feedbacks.
     *
     * @param id the id of the feedbacks to save.
     * @param feedbacks the feedbacks to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feedbacks,
     * or with status {@code 400 (Bad Request)} if the feedbacks is not valid,
     * or with status {@code 500 (Internal Server Error)} if the feedbacks couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/feedbacks/{id}")
    public ResponseEntity<Feedbacks> updateFeedbacks(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Feedbacks feedbacks
    ) throws URISyntaxException {
        log.debug("REST request to update Feedbacks : {}, {}", id, feedbacks);
        if (feedbacks.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feedbacks.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feedbacksRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Feedbacks result = feedbacksRepository.save(feedbacks);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, feedbacks.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /feedbacks/:id} : Partial updates given fields of an existing feedbacks, field will ignore if it is null
     *
     * @param id the id of the feedbacks to save.
     * @param feedbacks the feedbacks to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated feedbacks,
     * or with status {@code 400 (Bad Request)} if the feedbacks is not valid,
     * or with status {@code 404 (Not Found)} if the feedbacks is not found,
     * or with status {@code 500 (Internal Server Error)} if the feedbacks couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/feedbacks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Feedbacks> partialUpdateFeedbacks(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Feedbacks feedbacks
    ) throws URISyntaxException {
        log.debug("REST request to partial update Feedbacks partially : {}, {}", id, feedbacks);
        if (feedbacks.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, feedbacks.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!feedbacksRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Feedbacks> result = feedbacksRepository
            .findById(feedbacks.getId())
            .map(existingFeedbacks -> {
                if (feedbacks.getDate() != null) {
                    existingFeedbacks.setDate(feedbacks.getDate());
                }
                if (feedbacks.getUserName() != null) {
                    existingFeedbacks.setUserName(feedbacks.getUserName());
                }

                return existingFeedbacks;
            })
            .map(feedbacksRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, feedbacks.getId().toString())
        );
    }

    /**
     * {@code GET  /feedbacks} : get all the feedbacks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of feedbacks in body.
     */
    @GetMapping("/feedbacks")
    public List<Feedbacks> getAllFeedbacks() {
        log.debug("REST request to get all Feedbacks");
        return feedbacksRepository.findAll();
    }

    /**
     * {@code GET  /feedbacks/:id} : get the "id" feedbacks.
     *
     * @param id the id of the feedbacks to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the feedbacks, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/feedbacks/{id}")
    public ResponseEntity<Feedbacks> getFeedbacks(@PathVariable Long id) {
        log.debug("REST request to get Feedbacks : {}", id);
        Optional<Feedbacks> feedbacks = feedbacksRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(feedbacks);
    }

    /**
     * {@code DELETE  /feedbacks/:id} : delete the "id" feedbacks.
     *
     * @param id the id of the feedbacks to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/feedbacks/{id}")
    public ResponseEntity<Void> deleteFeedbacks(@PathVariable Long id) {
        log.debug("REST request to delete Feedbacks : {}", id);
        feedbacksRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
