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
import team.bham.domain.ItineraryActivity;
import team.bham.repository.ItineraryActivityRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ItineraryActivity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItineraryActivityResource {

    private final Logger log = LoggerFactory.getLogger(ItineraryActivityResource.class);

    private static final String ENTITY_NAME = "itineraryActivity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItineraryActivityRepository itineraryActivityRepository;

    public ItineraryActivityResource(ItineraryActivityRepository itineraryActivityRepository) {
        this.itineraryActivityRepository = itineraryActivityRepository;
    }

    /**
     * {@code POST  /itinerary-activities} : Create a new itineraryActivity.
     *
     * @param itineraryActivity the itineraryActivity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itineraryActivity, or with status {@code 400 (Bad Request)} if the itineraryActivity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/itinerary-activities")
    public ResponseEntity<ItineraryActivity> createItineraryActivity(@RequestBody ItineraryActivity itineraryActivity)
        throws URISyntaxException {
        log.debug("REST request to save ItineraryActivity : {}", itineraryActivity);
        if (itineraryActivity.getId() != null) {
            throw new BadRequestAlertException("A new itineraryActivity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItineraryActivity result = itineraryActivityRepository.save(itineraryActivity);
        return ResponseEntity
            .created(new URI("/api/itinerary-activities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /itinerary-activities/:id} : Updates an existing itineraryActivity.
     *
     * @param id the id of the itineraryActivity to save.
     * @param itineraryActivity the itineraryActivity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryActivity,
     * or with status {@code 400 (Bad Request)} if the itineraryActivity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itineraryActivity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/itinerary-activities/{id}")
    public ResponseEntity<ItineraryActivity> updateItineraryActivity(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryActivity itineraryActivity
    ) throws URISyntaxException {
        log.debug("REST request to update ItineraryActivity : {}, {}", id, itineraryActivity);
        if (itineraryActivity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryActivity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryActivityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItineraryActivity result = itineraryActivityRepository.save(itineraryActivity);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryActivity.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /itinerary-activities/:id} : Partial updates given fields of an existing itineraryActivity, field will ignore if it is null
     *
     * @param id the id of the itineraryActivity to save.
     * @param itineraryActivity the itineraryActivity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itineraryActivity,
     * or with status {@code 400 (Bad Request)} if the itineraryActivity is not valid,
     * or with status {@code 404 (Not Found)} if the itineraryActivity is not found,
     * or with status {@code 500 (Internal Server Error)} if the itineraryActivity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/itinerary-activities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItineraryActivity> partialUpdateItineraryActivity(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItineraryActivity itineraryActivity
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItineraryActivity partially : {}, {}", id, itineraryActivity);
        if (itineraryActivity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itineraryActivity.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itineraryActivityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItineraryActivity> result = itineraryActivityRepository
            .findById(itineraryActivity.getId())
            .map(existingItineraryActivity -> {
                if (itineraryActivity.getActivityName() != null) {
                    existingItineraryActivity.setActivityName(itineraryActivity.getActivityName());
                }
                if (itineraryActivity.getActivityCost() != null) {
                    existingItineraryActivity.setActivityCost(itineraryActivity.getActivityCost());
                }
                if (itineraryActivity.getActivityHost() != null) {
                    existingItineraryActivity.setActivityHost(itineraryActivity.getActivityHost());
                }
                if (itineraryActivity.getActivityTime() != null) {
                    existingItineraryActivity.setActivityTime(itineraryActivity.getActivityTime());
                }

                return existingItineraryActivity;
            })
            .map(itineraryActivityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, itineraryActivity.getId().toString())
        );
    }

    /**
     * {@code GET  /itinerary-activities} : get all the itineraryActivities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itineraryActivities in body.
     */
    @GetMapping("/itinerary-activities")
    public List<ItineraryActivity> getAllItineraryActivities() {
        log.debug("REST request to get all ItineraryActivities");
        return itineraryActivityRepository.findAll();
    }

    /**
     * {@code GET  /itinerary-activities/:id} : get the "id" itineraryActivity.
     *
     * @param id the id of the itineraryActivity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itineraryActivity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/itinerary-activities/{id}")
    public ResponseEntity<ItineraryActivity> getItineraryActivity(@PathVariable Long id) {
        log.debug("REST request to get ItineraryActivity : {}", id);
        Optional<ItineraryActivity> itineraryActivity = itineraryActivityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itineraryActivity);
    }

    /**
     * {@code DELETE  /itinerary-activities/:id} : delete the "id" itineraryActivity.
     *
     * @param id the id of the itineraryActivity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/itinerary-activities/{id}")
    public ResponseEntity<Void> deleteItineraryActivity(@PathVariable Long id) {
        log.debug("REST request to delete ItineraryActivity : {}", id);
        itineraryActivityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
