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
import team.bham.domain.ItineraryDateTime;
import team.bham.repository.ItineraryDateTimeRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ItineraryDateTime}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItineraryDateTimeResource {

    private final Logger log = LoggerFactory.getLogger(ItineraryDateTimeResource.class);

    private static final String ENTITY_NAME = "itineraryDateTime";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItineraryDateTimeRepository itineraryDateTimeRepository;

    public ItineraryDateTimeResource(ItineraryDateTimeRepository itineraryDateTimeRepository) {
        this.itineraryDateTimeRepository = itineraryDateTimeRepository;
    }

    /**
     * {@code POST  /itinerary-date-times} : Create a new itineraryDateTime.
     *
     * @param itineraryDateTime the itineraryDateTime to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itineraryDateTime, or with status {@code 400 (Bad Request)} if the itineraryDateTime has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/itinerary-date-times")
    public ResponseEntity<ItineraryDateTime> createItineraryDateTime(@RequestBody ItineraryDateTime itineraryDateTime)
        throws URISyntaxException {
        log.debug("REST request to save ItineraryDateTime : {}", itineraryDateTime);
        if (itineraryDateTime.getId() != null) {
            throw new BadRequestAlertException("A new itineraryDateTime cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItineraryDateTime result = itineraryDateTimeRepository.save(itineraryDateTime);
        return ResponseEntity
            .created(new URI("/api/itinerary-date-times/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /itinerary-date-times/:id} : Updates an existing itineraryDateTime.
     *
     * @param id the id of the itineraryDateTime to save.
     * @param itineraryDateTime the itineraryDateTime to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryDateTime,
     * or with status {@code 400 (Bad Request)} if the itineraryDateTime is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itineraryDateTime couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/itinerary-date-times/{id}")
    public ResponseEntity<ItineraryDateTime> updateItineraryDateTime(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryDateTime itineraryDateTime
    ) throws URISyntaxException {
        log.debug("REST request to update ItineraryDateTime : {}, {}", id, itineraryDateTime);
        if (itineraryDateTime.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryDateTime.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryDateTimeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItineraryDateTime result = itineraryDateTimeRepository.save(itineraryDateTime);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryDateTime.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /itinerary-date-times/:id} : Partial updates given fields of an existing itineraryDateTime, field will ignore if it is null
     *
     * @param id the id of the itineraryDateTime to save.
     * @param itineraryDateTime the itineraryDateTime to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryDateTime,
     * or with status {@code 400 (Bad Request)} if the itineraryDateTime is not valid,
     * or with status {@code 404 (Not Found)} if the itineraryDateTime is not found,
     * or with status {@code 500 (Internal Server Error)} if the itineraryDateTime couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/itinerary-date-times/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItineraryDateTime> partialUpdateItineraryDateTime(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryDateTime itineraryDateTime
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItineraryDateTime partially : {}, {}", id, itineraryDateTime);
        if (itineraryDateTime.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryDateTime.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryDateTimeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItineraryDateTime> result = itineraryDateTimeRepository
            .findById(itineraryDateTime.getId())
            .map(existingItineraryDateTime -> {
                if (itineraryDateTime.getDate() != null) {
                    existingItineraryDateTime.setDate(itineraryDateTime.getDate());
                }
                if (itineraryDateTime.getStartTime() != null) {
                    existingItineraryDateTime.setStartTime(itineraryDateTime.getStartTime());
                }
                if (itineraryDateTime.getEndTime() != null) {
                    existingItineraryDateTime.setEndTime(itineraryDateTime.getEndTime());
                }

                return existingItineraryDateTime;
            })
            .map(itineraryDateTimeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryDateTime.getId().toString())
        );
    }

    /**
     * {@code GET  /itinerary-date-times} : get all the itineraryDateTimes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itineraryDateTimes in body.
     */
    @GetMapping("/itinerary-date-times")
    public List<ItineraryDateTime> getAllItineraryDateTimes() {
        log.debug("REST request to get all ItineraryDateTimes");
        return itineraryDateTimeRepository.findAll();
    }

    /**
     * {@code GET  /itinerary-date-times/:id} : get the "id" itineraryDateTime.
     *
     * @param id the id of the itineraryDateTime to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itineraryDateTime, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/itinerary-date-times/{id}")
    public ResponseEntity<ItineraryDateTime> getItineraryDateTime(@PathVariable Long id) {
        log.debug("REST request to get ItineraryDateTime : {}", id);
        Optional<ItineraryDateTime> itineraryDateTime = itineraryDateTimeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itineraryDateTime);
    }

    /**
     * {@code DELETE  /itinerary-date-times/:id} : delete the "id" itineraryDateTime.
     *
     * @param id the id of the itineraryDateTime to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/itinerary-date-times/{id}")
    public ResponseEntity<Void> deleteItineraryDateTime(@PathVariable Long id) {
        log.debug("REST request to delete ItineraryDateTime : {}", id);
        itineraryDateTimeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
