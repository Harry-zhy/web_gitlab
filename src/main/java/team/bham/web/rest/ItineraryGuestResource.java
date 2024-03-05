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
import team.bham.domain.ItineraryGuest;
import team.bham.repository.ItineraryGuestRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ItineraryGuest}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItineraryGuestResource {

    private final Logger log = LoggerFactory.getLogger(ItineraryGuestResource.class);

    private static final String ENTITY_NAME = "itineraryGuest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItineraryGuestRepository itineraryGuestRepository;

    public ItineraryGuestResource(ItineraryGuestRepository itineraryGuestRepository) {
        this.itineraryGuestRepository = itineraryGuestRepository;
    }

    /**
     * {@code POST  /itinerary-guests} : Create a new itineraryGuest.
     *
     * @param itineraryGuest the itineraryGuest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itineraryGuest, or with status {@code 400 (Bad Request)} if the itineraryGuest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/itinerary-guests")
    public ResponseEntity<ItineraryGuest> createItineraryGuest(@RequestBody ItineraryGuest itineraryGuest) throws URISyntaxException {
        log.debug("REST request to save ItineraryGuest : {}", itineraryGuest);
        if (itineraryGuest.getId() != null) {
            throw new BadRequestAlertException("A new itineraryGuest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItineraryGuest result = itineraryGuestRepository.save(itineraryGuest);
        return ResponseEntity
            .created(new URI("/api/itinerary-guests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /itinerary-guests/:id} : Updates an existing itineraryGuest.
     *
     * @param id the id of the itineraryGuest to save.
     * @param itineraryGuest the itineraryGuest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryGuest,
     * or with status {@code 400 (Bad Request)} if the itineraryGuest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itineraryGuest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/itinerary-guests/{id}")
    public ResponseEntity<ItineraryGuest> updateItineraryGuest(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryGuest itineraryGuest
    ) throws URISyntaxException {
        log.debug("REST request to update ItineraryGuest : {}, {}", id, itineraryGuest);
        if (itineraryGuest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryGuest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryGuestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItineraryGuest result = itineraryGuestRepository.save(itineraryGuest);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryGuest.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /itinerary-guests/:id} : Partial updates given fields of an existing itineraryGuest, field will ignore if it is null
     *
     * @param id the id of the itineraryGuest to save.
     * @param itineraryGuest the itineraryGuest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryGuest,
     * or with status {@code 400 (Bad Request)} if the itineraryGuest is not valid,
     * or with status {@code 404 (Not Found)} if the itineraryGuest is not found,
     * or with status {@code 500 (Internal Server Error)} if the itineraryGuest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/itinerary-guests/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItineraryGuest> partialUpdateItineraryGuest(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryGuest itineraryGuest
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItineraryGuest partially : {}, {}", id, itineraryGuest);
        if (itineraryGuest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryGuest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryGuestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItineraryGuest> result = itineraryGuestRepository
            .findById(itineraryGuest.getId())
            .map(existingItineraryGuest -> {
                if (itineraryGuest.getName() != null) {
                    existingItineraryGuest.setName(itineraryGuest.getName());
                }
                if (itineraryGuest.getEmail() != null) {
                    existingItineraryGuest.setEmail(itineraryGuest.getEmail());
                }
                if (itineraryGuest.getRsvpStatus() != null) {
                    existingItineraryGuest.setRsvpStatus(itineraryGuest.getRsvpStatus());
                }

                return existingItineraryGuest;
            })
            .map(itineraryGuestRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryGuest.getId().toString())
        );
    }

    /**
     * {@code GET  /itinerary-guests} : get all the itineraryGuests.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itineraryGuests in body.
     */
    @GetMapping("/itinerary-guests")
    public List<ItineraryGuest> getAllItineraryGuests(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ItineraryGuests");
        if (eagerload) {
            return itineraryGuestRepository.findAllWithEagerRelationships();
        } else {
            return itineraryGuestRepository.findAll();
        }
    }

    /**
     * {@code GET  /itinerary-guests/:id} : get the "id" itineraryGuest.
     *
     * @param id the id of the itineraryGuest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itineraryGuest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/itinerary-guests/{id}")
    public ResponseEntity<ItineraryGuest> getItineraryGuest(@PathVariable Long id) {
        log.debug("REST request to get ItineraryGuest : {}", id);
        Optional<ItineraryGuest> itineraryGuest = itineraryGuestRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(itineraryGuest);
    }

    /**
     * {@code DELETE  /itinerary-guests/:id} : delete the "id" itineraryGuest.
     *
     * @param id the id of the itineraryGuest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/itinerary-guests/{id}")
    public ResponseEntity<Void> deleteItineraryGuest(@PathVariable Long id) {
        log.debug("REST request to delete ItineraryGuest : {}", id);
        itineraryGuestRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
