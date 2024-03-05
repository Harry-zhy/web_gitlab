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
import team.bham.domain.ActivityContactDetails;
import team.bham.repository.ActivityContactDetailsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ActivityContactDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivityContactDetailsResource {

    private final Logger log = LoggerFactory.getLogger(ActivityContactDetailsResource.class);

    private static final String ENTITY_NAME = "activityContactDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivityContactDetailsRepository activityContactDetailsRepository;

    public ActivityContactDetailsResource(ActivityContactDetailsRepository activityContactDetailsRepository) {
        this.activityContactDetailsRepository = activityContactDetailsRepository;
    }

    /**
     * {@code POST  /activity-contact-details} : Create a new activityContactDetails.
     *
     * @param activityContactDetails the activityContactDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activityContactDetails, or with status {@code 400 (Bad Request)} if the activityContactDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-contact-details")
    public ResponseEntity<ActivityContactDetails> createActivityContactDetails(@RequestBody ActivityContactDetails activityContactDetails)
        throws URISyntaxException {
        log.debug("REST request to save ActivityContactDetails : {}", activityContactDetails);
        if (activityContactDetails.getId() != null) {
            throw new BadRequestAlertException("A new activityContactDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActivityContactDetails result = activityContactDetailsRepository.save(activityContactDetails);
        return ResponseEntity
            .created(new URI("/api/activity-contact-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-contact-details/:id} : Updates an existing activityContactDetails.
     *
     * @param id the id of the activityContactDetails to save.
     * @param activityContactDetails the activityContactDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityContactDetails,
     * or with status {@code 400 (Bad Request)} if the activityContactDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activityContactDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activity-contact-details/{id}")
    public ResponseEntity<ActivityContactDetails> updateActivityContactDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActivityContactDetails activityContactDetails
    ) throws URISyntaxException {
        log.debug("REST request to update ActivityContactDetails : {}, {}", id, activityContactDetails);
        if (activityContactDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityContactDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityContactDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActivityContactDetails result = activityContactDetailsRepository.save(activityContactDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityContactDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /activity-contact-details/:id} : Partial updates given fields of an existing activityContactDetails, field will ignore if it is null
     *
     * @param id the id of the activityContactDetails to save.
     * @param activityContactDetails the activityContactDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityContactDetails,
     * or with status {@code 400 (Bad Request)} if the activityContactDetails is not valid,
     * or with status {@code 404 (Not Found)} if the activityContactDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the activityContactDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activity-contact-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActivityContactDetails> partialUpdateActivityContactDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActivityContactDetails activityContactDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActivityContactDetails partially : {}, {}", id, activityContactDetails);
        if (activityContactDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityContactDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityContactDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActivityContactDetails> result = activityContactDetailsRepository
            .findById(activityContactDetails.getId())
            .map(existingActivityContactDetails -> {
                if (activityContactDetails.getWebsite() != null) {
                    existingActivityContactDetails.setWebsite(activityContactDetails.getWebsite());
                }
                if (activityContactDetails.getTwitter() != null) {
                    existingActivityContactDetails.setTwitter(activityContactDetails.getTwitter());
                }
                if (activityContactDetails.getInstagram() != null) {
                    existingActivityContactDetails.setInstagram(activityContactDetails.getInstagram());
                }
                if (activityContactDetails.getFacebook() != null) {
                    existingActivityContactDetails.setFacebook(activityContactDetails.getFacebook());
                }
                if (activityContactDetails.getTiktok() != null) {
                    existingActivityContactDetails.setTiktok(activityContactDetails.getTiktok());
                }
                if (activityContactDetails.getPhoneNumber() != null) {
                    existingActivityContactDetails.setPhoneNumber(activityContactDetails.getPhoneNumber());
                }

                return existingActivityContactDetails;
            })
            .map(activityContactDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityContactDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /activity-contact-details} : get all the activityContactDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activityContactDetails in body.
     */
    @GetMapping("/activity-contact-details")
    public List<ActivityContactDetails> getAllActivityContactDetails() {
        log.debug("REST request to get all ActivityContactDetails");
        return activityContactDetailsRepository.findAll();
    }

    /**
     * {@code GET  /activity-contact-details/:id} : get the "id" activityContactDetails.
     *
     * @param id the id of the activityContactDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activityContactDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-contact-details/{id}")
    public ResponseEntity<ActivityContactDetails> getActivityContactDetails(@PathVariable Long id) {
        log.debug("REST request to get ActivityContactDetails : {}", id);
        Optional<ActivityContactDetails> activityContactDetails = activityContactDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activityContactDetails);
    }

    /**
     * {@code DELETE  /activity-contact-details/:id} : delete the "id" activityContactDetails.
     *
     * @param id the id of the activityContactDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-contact-details/{id}")
    public ResponseEntity<Void> deleteActivityContactDetails(@PathVariable Long id) {
        log.debug("REST request to delete ActivityContactDetails : {}", id);
        activityContactDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
