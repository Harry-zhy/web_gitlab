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
import team.bham.domain.Itinerary;
import team.bham.repository.ItineraryRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Itinerary}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItineraryResource {

    private final Logger log = LoggerFactory.getLogger(ItineraryResource.class);

    private static final String ENTITY_NAME = "itinerary";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItineraryRepository itineraryRepository;

    public ItineraryResource(ItineraryRepository itineraryRepository) {
        this.itineraryRepository = itineraryRepository;
    }

    /**
     * {@code POST  /itineraries} : Create a new itinerary.
     *
     * @param itinerary the itinerary to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itinerary, or with status {@code 400 (Bad Request)} if the itinerary has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/itineraries")
    public ResponseEntity<Itinerary> createItinerary(@RequestBody Itinerary itinerary) throws URISyntaxException {
        log.debug("REST request to save Itinerary : {}", itinerary);
        if (itinerary.getId() != null) {
            throw new BadRequestAlertException("A new itinerary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Itinerary result = itineraryRepository.save(itinerary);
        return ResponseEntity
            .created(new URI("/api/itineraries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /itineraries/:id} : Updates an existing itinerary.
     *
     * @param id the id of the itinerary to save.
     * @param itinerary the itinerary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itinerary,
     * or with status {@code 400 (Bad Request)} if the itinerary is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itinerary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/itineraries/{id}")
    public ResponseEntity<Itinerary> updateItinerary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Itinerary itinerary
    ) throws URISyntaxException {
        log.debug("REST request to update Itinerary : {}, {}", id, itinerary);
        if (itinerary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itinerary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Itinerary result = itineraryRepository.save(itinerary);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itinerary.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /itineraries/:id} : Partial updates given fields of an existing itinerary, field will ignore if it is null
     *
     * @param id the id of the itinerary to save.
     * @param itinerary the itinerary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itinerary,
     * or with status {@code 400 (Bad Request)} if the itinerary is not valid,
     * or with status {@code 404 (Not Found)} if the itinerary is not found,
     * or with status {@code 500 (Internal Server Error)} if the itinerary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/itineraries/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Itinerary> partialUpdateItinerary(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Itinerary itinerary
    ) throws URISyntaxException {
        log.debug("REST request to partial update Itinerary partially : {}, {}", id, itinerary);
        if (itinerary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itinerary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Itinerary> result = itineraryRepository
            .findById(itinerary.getId())
            .map(existingItinerary -> {
                if (itinerary.getStartTime() != null) {
                    existingItinerary.setStartTime(itinerary.getStartTime());
                }
                if (itinerary.getEndTime() != null) {
                    existingItinerary.setEndTime(itinerary.getEndTime());
                }
                if (itinerary.getLocation() != null) {
                    existingItinerary.setLocation(itinerary.getLocation());
                }

                return existingItinerary;
            })
            .map(itineraryRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itinerary.getId().toString())
        );
    }

    /**
     * {@code GET  /itineraries} : get all the itineraries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itineraries in body.
     */
    @GetMapping("/itineraries")
    public List<Itinerary> getAllItineraries() {
        log.debug("REST request to get all Itineraries");
        return itineraryRepository.findAll();
    }

    /**
     * {@code GET  /itineraries/:id} : get the "id" itinerary.
     *
     * @param id the id of the itinerary to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itinerary, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/itineraries/{id}")
    public ResponseEntity<Itinerary> getItinerary(@PathVariable Long id) {
        log.debug("REST request to get Itinerary : {}", id);
        Optional<Itinerary> itinerary = itineraryRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itinerary);
    }

    /**
     * {@code DELETE  /itineraries/:id} : delete the "id" itinerary.
     *
     * @param id the id of the itinerary to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/itineraries/{id}")
    public ResponseEntity<Void> deleteItinerary(@PathVariable Long id) {
        log.debug("REST request to delete Itinerary : {}", id);
        itineraryRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
