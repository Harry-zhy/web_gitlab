package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.BookedCaterer;
import team.bham.repository.BookedCatererRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.BookedCaterer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookedCatererResource {

    private final Logger log = LoggerFactory.getLogger(BookedCatererResource.class);

    private static final String ENTITY_NAME = "bookedCaterer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookedCatererRepository bookedCatererRepository;

    public BookedCatererResource(BookedCatererRepository bookedCatererRepository) {
        this.bookedCatererRepository = bookedCatererRepository;
    }

    /**
     * {@code POST  /booked-caterers} : Create a new bookedCaterer.
     *
     * @param bookedCaterer the bookedCaterer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bookedCaterer, or with status {@code 400 (Bad Request)} if the bookedCaterer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/booked-caterers")
    public ResponseEntity<BookedCaterer> createBookedCaterer(@RequestBody BookedCaterer bookedCaterer) throws URISyntaxException {
        log.debug("REST request to save BookedCaterer : {}", bookedCaterer);
        if (bookedCaterer.getId() != null) {
            throw new BadRequestAlertException("A new bookedCaterer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BookedCaterer result = bookedCatererRepository.save(bookedCaterer);
        return ResponseEntity
            .created(new URI("/api/booked-caterers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /booked-caterers/:id} : Updates an existing bookedCaterer.
     *
     * @param id the id of the bookedCaterer to save.
     * @param bookedCaterer the bookedCaterer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookedCaterer,
     * or with status {@code 400 (Bad Request)} if the bookedCaterer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bookedCaterer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/booked-caterers/{id}")
    public ResponseEntity<BookedCaterer> updateBookedCaterer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BookedCaterer bookedCaterer
    ) throws URISyntaxException {
        log.debug("REST request to update BookedCaterer : {}, {}", id, bookedCaterer);
        if (bookedCaterer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookedCaterer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookedCatererRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BookedCaterer result = bookedCatererRepository.save(bookedCaterer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bookedCaterer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /booked-caterers/:id} : Partial updates given fields of an existing bookedCaterer, field will ignore if it is null
     *
     * @param id the id of the bookedCaterer to save.
     * @param bookedCaterer the bookedCaterer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bookedCaterer,
     * or with status {@code 400 (Bad Request)} if the bookedCaterer is not valid,
     * or with status {@code 404 (Not Found)} if the bookedCaterer is not found,
     * or with status {@code 500 (Internal Server Error)} if the bookedCaterer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/booked-caterers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BookedCaterer> partialUpdateBookedCaterer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BookedCaterer bookedCaterer
    ) throws URISyntaxException {
        log.debug("REST request to partial update BookedCaterer partially : {}, {}", id, bookedCaterer);
        if (bookedCaterer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bookedCaterer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookedCatererRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BookedCaterer> result = bookedCatererRepository
            .findById(bookedCaterer.getId())
            .map(existingBookedCaterer -> {
                if (bookedCaterer.getConfirmationStatus() != null) {
                    existingBookedCaterer.setConfirmationStatus(bookedCaterer.getConfirmationStatus());
                }

                return existingBookedCaterer;
            })
            .map(bookedCatererRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bookedCaterer.getId().toString())
        );
    }

    /**
     * {@code GET  /booked-caterers} : get all the bookedCaterers.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookedCaterers in body.
     */
    @GetMapping("/booked-caterers")
    public List<BookedCaterer> getAllBookedCaterers(@RequestParam(required = false) String filter) {
        if ("caterers-is-null".equals(filter)) {
            log.debug("REST request to get all BookedCaterers where caterers is null");
            return StreamSupport
                .stream(bookedCatererRepository.findAll().spliterator(), false)
                .filter(bookedCaterer -> bookedCaterer.getCaterers() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all BookedCaterers");
        return bookedCatererRepository.findAll();
    }

    /**
     * {@code GET  /booked-caterers/:id} : get the "id" bookedCaterer.
     *
     * @param id the id of the bookedCaterer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bookedCaterer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/booked-caterers/{id}")
    public ResponseEntity<BookedCaterer> getBookedCaterer(@PathVariable Long id) {
        log.debug("REST request to get BookedCaterer : {}", id);
        Optional<BookedCaterer> bookedCaterer = bookedCatererRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bookedCaterer);
    }

    /**
     * {@code DELETE  /booked-caterers/:id} : delete the "id" bookedCaterer.
     *
     * @param id the id of the bookedCaterer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/booked-caterers/{id}")
    public ResponseEntity<Void> deleteBookedCaterer(@PathVariable Long id) {
        log.debug("REST request to delete BookedCaterer : {}", id);
        bookedCatererRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
