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
import team.bham.domain.ItineraryCaterer;
import team.bham.repository.ItineraryCatererRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ItineraryCaterer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItineraryCatererResource {

    private final Logger log = LoggerFactory.getLogger(ItineraryCatererResource.class);

    private static final String ENTITY_NAME = "itineraryCaterer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItineraryCatererRepository itineraryCatererRepository;

    public ItineraryCatererResource(ItineraryCatererRepository itineraryCatererRepository) {
        this.itineraryCatererRepository = itineraryCatererRepository;
    }

    /**
     * {@code POST  /itinerary-caterers} : Create a new itineraryCaterer.
     *
     * @param itineraryCaterer the itineraryCaterer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itineraryCaterer, or with status {@code 400 (Bad Request)} if the itineraryCaterer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/itinerary-caterers")
    public ResponseEntity<ItineraryCaterer> createItineraryCaterer(@RequestBody ItineraryCaterer itineraryCaterer)
        throws URISyntaxException {
        log.debug("REST request to save ItineraryCaterer : {}", itineraryCaterer);
        if (itineraryCaterer.getId() != null) {
            throw new BadRequestAlertException("A new itineraryCaterer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItineraryCaterer result = itineraryCatererRepository.save(itineraryCaterer);
        return ResponseEntity
            .created(new URI("/api/itinerary-caterers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /itinerary-caterers/:id} : Updates an existing itineraryCaterer.
     *
     * @param id the id of the itineraryCaterer to save.
     * @param itineraryCaterer the itineraryCaterer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryCaterer,
     * or with status {@code 400 (Bad Request)} if the itineraryCaterer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itineraryCaterer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/itinerary-caterers/{id}")
    public ResponseEntity<ItineraryCaterer> updateItineraryCaterer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryCaterer itineraryCaterer
    ) throws URISyntaxException {
        log.debug("REST request to update ItineraryCaterer : {}, {}", id, itineraryCaterer);
        if (itineraryCaterer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryCaterer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryCatererRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItineraryCaterer result = itineraryCatererRepository.save(itineraryCaterer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryCaterer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /itinerary-caterers/:id} : Partial updates given fields of an existing itineraryCaterer, field will ignore if it is null
     *
     * @param id the id of the itineraryCaterer to save.
     * @param itineraryCaterer the itineraryCaterer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryCaterer,
     * or with status {@code 400 (Bad Request)} if the itineraryCaterer is not valid,
     * or with status {@code 404 (Not Found)} if the itineraryCaterer is not found,
     * or with status {@code 500 (Internal Server Error)} if the itineraryCaterer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/itinerary-caterers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItineraryCaterer> partialUpdateItineraryCaterer(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryCaterer itineraryCaterer
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItineraryCaterer partially : {}, {}", id, itineraryCaterer);
        if (itineraryCaterer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryCaterer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryCatererRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItineraryCaterer> result = itineraryCatererRepository
            .findById(itineraryCaterer.getId())
            .map(existingItineraryCaterer -> {
                if (itineraryCaterer.getCatererName() != null) {
                    existingItineraryCaterer.setCatererName(itineraryCaterer.getCatererName());
                }
                if (itineraryCaterer.getCatererCost() != null) {
                    existingItineraryCaterer.setCatererCost(itineraryCaterer.getCatererCost());
                }
                if (itineraryCaterer.getCatererHost() != null) {
                    existingItineraryCaterer.setCatererHost(itineraryCaterer.getCatererHost());
                }
                if (itineraryCaterer.getCatererTime() != null) {
                    existingItineraryCaterer.setCatererTime(itineraryCaterer.getCatererTime());
                }

                return existingItineraryCaterer;
            })
            .map(itineraryCatererRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryCaterer.getId().toString())
        );
    }

    /**
     * {@code GET  /itinerary-caterers} : get all the itineraryCaterers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itineraryCaterers in body.
     */
    @GetMapping("/itinerary-caterers")
    public List<ItineraryCaterer> getAllItineraryCaterers() {
        log.debug("REST request to get all ItineraryCaterers");
        return itineraryCatererRepository.findAll();
    }

    /**
     * {@code GET  /itinerary-caterers/:id} : get the "id" itineraryCaterer.
     *
     * @param id the id of the itineraryCaterer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itineraryCaterer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/itinerary-caterers/{id}")
    public ResponseEntity<ItineraryCaterer> getItineraryCaterer(@PathVariable Long id) {
        log.debug("REST request to get ItineraryCaterer : {}", id);
        Optional<ItineraryCaterer> itineraryCaterer = itineraryCatererRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itineraryCaterer);
    }

    /**
     * {@code DELETE  /itinerary-caterers/:id} : delete the "id" itineraryCaterer.
     *
     * @param id the id of the itineraryCaterer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/itinerary-caterers/{id}")
    public ResponseEntity<Void> deleteItineraryCaterer(@PathVariable Long id) {
        log.debug("REST request to delete ItineraryCaterer : {}", id);
        itineraryCatererRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
