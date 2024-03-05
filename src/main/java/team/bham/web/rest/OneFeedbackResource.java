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
import team.bham.domain.OneFeedback;
import team.bham.repository.OneFeedbackRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.OneFeedback}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OneFeedbackResource {

    private final Logger log = LoggerFactory.getLogger(OneFeedbackResource.class);

    private static final String ENTITY_NAME = "oneFeedback";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OneFeedbackRepository oneFeedbackRepository;

    public OneFeedbackResource(OneFeedbackRepository oneFeedbackRepository) {
        this.oneFeedbackRepository = oneFeedbackRepository;
    }

    /**
     * {@code POST  /one-feedbacks} : Create a new oneFeedback.
     *
     * @param oneFeedback the oneFeedback to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new oneFeedback, or with status {@code 400 (Bad Request)} if the oneFeedback has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/one-feedbacks")
    public ResponseEntity<OneFeedback> createOneFeedback(@Valid @RequestBody OneFeedback oneFeedback) throws URISyntaxException {
        log.debug("REST request to save OneFeedback : {}", oneFeedback);
        if (oneFeedback.getId() != null) {
            throw new BadRequestAlertException("A new oneFeedback cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OneFeedback result = oneFeedbackRepository.save(oneFeedback);
        return ResponseEntity
            .created(new URI("/api/one-feedbacks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /one-feedbacks/:id} : Updates an existing oneFeedback.
     *
     * @param id the id of the oneFeedback to save.
     * @param oneFeedback the oneFeedback to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated oneFeedback,
     * or with status {@code 400 (Bad Request)} if the oneFeedback is not valid,
     * or with status {@code 500 (Internal Server Error)} if the oneFeedback couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/one-feedbacks/{id}")
    public ResponseEntity<OneFeedback> updateOneFeedback(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OneFeedback oneFeedback
    ) throws URISyntaxException {
        log.debug("REST request to update OneFeedback : {}, {}", id, oneFeedback);
        if (oneFeedback.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, oneFeedback.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!oneFeedbackRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OneFeedback result = oneFeedbackRepository.save(oneFeedback);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, oneFeedback.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /one-feedbacks/:id} : Partial updates given fields of an existing oneFeedback, field will ignore if it is null
     *
     * @param id the id of the oneFeedback to save.
     * @param oneFeedback the oneFeedback to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated oneFeedback,
     * or with status {@code 400 (Bad Request)} if the oneFeedback is not valid,
     * or with status {@code 404 (Not Found)} if the oneFeedback is not found,
     * or with status {@code 500 (Internal Server Error)} if the oneFeedback couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/one-feedbacks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OneFeedback> partialUpdateOneFeedback(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OneFeedback oneFeedback
    ) throws URISyntaxException {
        log.debug("REST request to partial update OneFeedback partially : {}, {}", id, oneFeedback);
        if (oneFeedback.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, oneFeedback.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!oneFeedbackRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OneFeedback> result = oneFeedbackRepository
            .findById(oneFeedback.getId())
            .map(existingOneFeedback -> {
                if (oneFeedback.getContent() != null) {
                    existingOneFeedback.setContent(oneFeedback.getContent());
                }
                if (oneFeedback.getWithMultiMedia() != null) {
                    existingOneFeedback.setWithMultiMedia(oneFeedback.getWithMultiMedia());
                }
                if (oneFeedback.getImagePath() != null) {
                    existingOneFeedback.setImagePath(oneFeedback.getImagePath());
                }
                if (oneFeedback.getVideoPath() != null) {
                    existingOneFeedback.setVideoPath(oneFeedback.getVideoPath());
                }

                return existingOneFeedback;
            })
            .map(oneFeedbackRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, oneFeedback.getId().toString())
        );
    }

    /**
     * {@code GET  /one-feedbacks} : get all the oneFeedbacks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of oneFeedbacks in body.
     */
    @GetMapping("/one-feedbacks")
    public List<OneFeedback> getAllOneFeedbacks() {
        log.debug("REST request to get all OneFeedbacks");
        return oneFeedbackRepository.findAll();
    }

    /**
     * {@code GET  /one-feedbacks/:id} : get the "id" oneFeedback.
     *
     * @param id the id of the oneFeedback to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the oneFeedback, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/one-feedbacks/{id}")
    public ResponseEntity<OneFeedback> getOneFeedback(@PathVariable Long id) {
        log.debug("REST request to get OneFeedback : {}", id);
        Optional<OneFeedback> oneFeedback = oneFeedbackRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(oneFeedback);
    }

    /**
     * {@code DELETE  /one-feedbacks/:id} : delete the "id" oneFeedback.
     *
     * @param id the id of the oneFeedback to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/one-feedbacks/{id}")
    public ResponseEntity<Void> deleteOneFeedback(@PathVariable Long id) {
        log.debug("REST request to delete OneFeedback : {}", id);
        oneFeedbackRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
