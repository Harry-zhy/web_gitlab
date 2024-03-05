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
import team.bham.domain.ItineraryVenue;
import team.bham.repository.ItineraryVenueRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ItineraryVenue}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItineraryVenueResource {

    private final Logger log = LoggerFactory.getLogger(ItineraryVenueResource.class);

    private static final String ENTITY_NAME = "itineraryVenue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItineraryVenueRepository itineraryVenueRepository;

    public ItineraryVenueResource(ItineraryVenueRepository itineraryVenueRepository) {
        this.itineraryVenueRepository = itineraryVenueRepository;
    }

    /**
     * {@code POST  /itinerary-venues} : Create a new itineraryVenue.
     *
     * @param itineraryVenue the itineraryVenue to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itineraryVenue, or with status {@code 400 (Bad Request)} if the itineraryVenue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/itinerary-venues")
    public ResponseEntity<ItineraryVenue> createItineraryVenue(@RequestBody ItineraryVenue itineraryVenue) throws URISyntaxException {
        log.debug("REST request to save ItineraryVenue : {}", itineraryVenue);
        if (itineraryVenue.getId() != null) {
            throw new BadRequestAlertException("A new itineraryVenue cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItineraryVenue result = itineraryVenueRepository.save(itineraryVenue);
        return ResponseEntity
            .created(new URI("/api/itinerary-venues/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /itinerary-venues/:id} : Updates an existing itineraryVenue.
     *
     * @param id the id of the itineraryVenue to save.
     * @param itineraryVenue the itineraryVenue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryVenue,
     * or with status {@code 400 (Bad Request)} if the itineraryVenue is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itineraryVenue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/itinerary-venues/{id}")
    public ResponseEntity<ItineraryVenue> updateItineraryVenue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryVenue itineraryVenue
    ) throws URISyntaxException {
        log.debug("REST request to update ItineraryVenue : {}, {}", id, itineraryVenue);
        if (itineraryVenue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryVenue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryVenueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItineraryVenue result = itineraryVenueRepository.save(itineraryVenue);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryVenue.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /itinerary-venues/:id} : Partial updates given fields of an existing itineraryVenue, field will ignore if it is null
     *
     * @param id the id of the itineraryVenue to save.
     * @param itineraryVenue the itineraryVenue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryVenue,
     * or with status {@code 400 (Bad Request)} if the itineraryVenue is not valid,
     * or with status {@code 404 (Not Found)} if the itineraryVenue is not found,
     * or with status {@code 500 (Internal Server Error)} if the itineraryVenue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/itinerary-venues/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItineraryVenue> partialUpdateItineraryVenue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryVenue itineraryVenue
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItineraryVenue partially : {}, {}", id, itineraryVenue);
        if (itineraryVenue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryVenue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryVenueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItineraryVenue> result = itineraryVenueRepository
            .findById(itineraryVenue.getId())
            .map(existingItineraryVenue -> {
                if (itineraryVenue.getVenueName() != null) {
                    existingItineraryVenue.setVenueName(itineraryVenue.getVenueName());
                }
                if (itineraryVenue.getVenueCost() != null) {
                    existingItineraryVenue.setVenueCost(itineraryVenue.getVenueCost());
                }
                if (itineraryVenue.getVenueHost() != null) {
                    existingItineraryVenue.setVenueHost(itineraryVenue.getVenueHost());
                }
                if (itineraryVenue.getVenueAddress() != null) {
                    existingItineraryVenue.setVenueAddress(itineraryVenue.getVenueAddress());
                }

                return existingItineraryVenue;
            })
            .map(itineraryVenueRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryVenue.getId().toString())
        );
    }

    /**
     * {@code GET  /itinerary-venues} : get all the itineraryVenues.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itineraryVenues in body.
     */
    @GetMapping("/itinerary-venues")
    public List<ItineraryVenue> getAllItineraryVenues() {
        log.debug("REST request to get all ItineraryVenues");
        return itineraryVenueRepository.findAll();
    }

    /**
     * {@code GET  /itinerary-venues/:id} : get the "id" itineraryVenue.
     *
     * @param id the id of the itineraryVenue to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itineraryVenue, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/itinerary-venues/{id}")
    public ResponseEntity<ItineraryVenue> getItineraryVenue(@PathVariable Long id) {
        log.debug("REST request to get ItineraryVenue : {}", id);
        Optional<ItineraryVenue> itineraryVenue = itineraryVenueRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itineraryVenue);
    }

    /**
     * {@code DELETE  /itinerary-venues/:id} : delete the "id" itineraryVenue.
     *
     * @param id the id of the itineraryVenue to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/itinerary-venues/{id}")
    public ResponseEntity<Void> deleteItineraryVenue(@PathVariable Long id) {
        log.debug("REST request to delete ItineraryVenue : {}", id);
        itineraryVenueRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
