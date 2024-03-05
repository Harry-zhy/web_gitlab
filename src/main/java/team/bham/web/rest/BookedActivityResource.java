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
import team.bham.domain.BookedActivity;
import team.bham.repository.BookedActivityRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.BookedActivity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookedActivityResource {

    private final Logger log = LoggerFactory.getLogger(BookedActivityResource.class);

    private static final String ENTITY_NAME = "bookedActivity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookedActivityRepository bookedActivityRepository;

    public BookedActivityResource(BookedActivityRepository bookedActivityRepository) {
        this.bookedActivityRepository = bookedActivityRepository;
    }

    /**
     * {@code POST  /booked-activities} : Create a new bookedActivity.
     *
     * @param bookedActivity the bookedActivity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookedActivity, or with status {@code 400 (Bad Request)} if the bookedActivity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/booked-activities")
    public ResponseEntity<BookedActivity> createBookedActivity(@Valid @RequestBody BookedActivity bookedActivity)
        throws URISyntaxException {
        log.debug("REST request to save BookedActivity : {}", bookedActivity);
        if (bookedActivity.getId() != null) {
            throw new BadRequestAlertException("A new bookedActivity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BookedActivity result = bookedActivityRepository.save(bookedActivity);
        return ResponseEntity
            .created(new URI("/api/booked-activities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /booked-activities/:id} : Updates an existing bookedActivity.
     *
     * @param id the id of the bookedActivity to save.
     * @param bookedActivity the bookedActivity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookedActivity,
     * or with status {@code 400 (Bad Request)} if the bookedActivity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookedActivity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/booked-activities/{id}")
    public ResponseEntity<BookedActivity> updateBookedActivity(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BookedActivity bookedActivity
    ) throws URISyntaxException {
        log.debug("REST request to update BookedActivity : {}, {}", id, bookedActivity);
        if (bookedActivity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookedActivity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookedActivityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BookedActivity result = bookedActivityRepository.save(bookedActivity);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bookedActivity.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /booked-activities/:id} : Partial updates given fields of an existing bookedActivity, field will ignore if it is null
     *
     * @param id the id of the bookedActivity to save.
     * @param bookedActivity the bookedActivity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookedActivity,
     * or with status {@code 400 (Bad Request)} if the bookedActivity is not valid,
     * or with status {@code 404 (Not Found)} if the bookedActivity is not found,
     * or with status {@code 500 (Internal Server Error)} if the bookedActivity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/booked-activities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BookedActivity> partialUpdateBookedActivity(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BookedActivity bookedActivity
    ) throws URISyntaxException {
        log.debug("REST request to partial update BookedActivity partially : {}, {}", id, bookedActivity);
        if (bookedActivity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookedActivity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookedActivityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BookedActivity> result = bookedActivityRepository
            .findById(bookedActivity.getId())
            .map(existingBookedActivity -> {
                if (bookedActivity.getName() != null) {
                    existingBookedActivity.setName(bookedActivity.getName());
                }

                return existingBookedActivity;
            })
            .map(bookedActivityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bookedActivity.getId().toString())
        );
    }

    /**
     * {@code GET  /booked-activities} : get all the bookedActivities.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookedActivities in body.
     */
    @GetMapping("/booked-activities")
    public List<BookedActivity> getAllBookedActivities(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all BookedActivities");
        if (eagerload) {
            return bookedActivityRepository.findAllWithEagerRelationships();
        } else {
            return bookedActivityRepository.findAll();
        }
    }

    /**
     * {@code GET  /booked-activities/:id} : get the "id" bookedActivity.
     *
     * @param id the id of the bookedActivity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookedActivity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/booked-activities/{id}")
    public ResponseEntity<BookedActivity> getBookedActivity(@PathVariable Long id) {
        log.debug("REST request to get BookedActivity : {}", id);
        Optional<BookedActivity> bookedActivity = bookedActivityRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(bookedActivity);
    }

    /**
     * {@code DELETE  /booked-activities/:id} : delete the "id" bookedActivity.
     *
     * @param id the id of the bookedActivity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/booked-activities/{id}")
    public ResponseEntity<Void> deleteBookedActivity(@PathVariable Long id) {
        log.debug("REST request to delete BookedActivity : {}", id);
        bookedActivityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
