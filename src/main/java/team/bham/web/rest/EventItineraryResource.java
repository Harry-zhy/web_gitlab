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
import team.bham.domain.EventItinerary;
import team.bham.repository.EventItineraryRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.EventItinerary}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EventItineraryResource {

    private final Logger log = LoggerFactory.getLogger(EventItineraryResource.class);

    private static final String ENTITY_NAME = "eventItinerary";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventItineraryRepository eventItineraryRepository;

    public EventItineraryResource(EventItineraryRepository eventItineraryRepository) {
        this.eventItineraryRepository = eventItineraryRepository;
    }

    /**
     * {@code POST  /event-itineraries} : Create a new eventItinerary.
     *
     * @param eventItinerary the eventItinerary to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eventItinerary, or with status {@code 400 (Bad Request)} if the eventItinerary has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/event-itineraries")
    public ResponseEntity<EventItinerary> createEventItinerary(@RequestBody EventItinerary eventItinerary) throws URISyntaxException {
        log.debug("REST request to save EventItinerary : {}", eventItinerary);
        if (eventItinerary.getId() != null) {
            throw new BadRequestAlertException("A new eventItinerary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventItinerary result = eventItineraryRepository.save(eventItinerary);
        return ResponseEntity
            .created(new URI("/api/event-itineraries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /event-itineraries/:id} : Updates an existing eventItinerary.
     *
     * @param id the id of the eventItinerary to save.
     * @param eventItinerary the eventItinerary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventItinerary,
     * or with status {@code 400 (Bad Request)} if the eventItinerary is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eventItinerary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/event-itineraries/{id}")
    public ResponseEntity<EventItinerary> updateEventItinerary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventItinerary eventItinerary
    ) throws URISyntaxException {
        log.debug("REST request to update EventItinerary : {}, {}", id, eventItinerary);
        if (eventItinerary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventItinerary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventItineraryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EventItinerary result = eventItineraryRepository.save(eventItinerary);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventItinerary.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /event-itineraries/:id} : Partial updates given fields of an existing eventItinerary, field will ignore if it is null
     *
     * @param id the id of the eventItinerary to save.
     * @param eventItinerary the eventItinerary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eventItinerary,
     * or with status {@code 400 (Bad Request)} if the eventItinerary is not valid,
     * or with status {@code 404 (Not Found)} if the eventItinerary is not found,
     * or with status {@code 500 (Internal Server Error)} if the eventItinerary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/event-itineraries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EventItinerary> partialUpdateEventItinerary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EventItinerary eventItinerary
    ) throws URISyntaxException {
        log.debug("REST request to partial update EventItinerary partially : {}, {}", id, eventItinerary);
        if (eventItinerary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eventItinerary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventItineraryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EventItinerary> result = eventItineraryRepository
            .findById(eventItinerary.getId())
            .map(existingEventItinerary -> {
                if (eventItinerary.getNumberOfGuests() != null) {
                    existingEventItinerary.setNumberOfGuests(eventItinerary.getNumberOfGuests());
                }

                return existingEventItinerary;
            })
            .map(eventItineraryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, eventItinerary.getId().toString())
        );
    }

    /**
     * {@code GET  /event-itineraries} : get all the eventItineraries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eventItineraries in body.
     */
    @GetMapping("/event-itineraries")
    public List<EventItinerary> getAllEventItineraries() {
        log.debug("REST request to get all EventItineraries");
        return eventItineraryRepository.findAll();
    }

    /**
     * {@code GET  /event-itineraries/:id} : get the "id" eventItinerary.
     *
     * @param id the id of the eventItinerary to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eventItinerary, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/event-itineraries/{id}")
    public ResponseEntity<EventItinerary> getEventItinerary(@PathVariable Long id) {
        log.debug("REST request to get EventItinerary : {}", id);
        Optional<EventItinerary> eventItinerary = eventItineraryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(eventItinerary);
    }

    /**
     * {@code DELETE  /event-itineraries/:id} : delete the "id" eventItinerary.
     *
     * @param id the id of the eventItinerary to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/event-itineraries/{id}")
    public ResponseEntity<Void> deleteEventItinerary(@PathVariable Long id) {
        log.debug("REST request to delete EventItinerary : {}", id);
        eventItineraryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
