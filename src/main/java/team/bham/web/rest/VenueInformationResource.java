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
import team.bham.domain.VenueInformation;
import team.bham.repository.VenueInformationRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.VenueInformation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VenueInformationResource {

    private final Logger log = LoggerFactory.getLogger(VenueInformationResource.class);

    private static final String ENTITY_NAME = "venueInformation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VenueInformationRepository venueInformationRepository;

    public VenueInformationResource(VenueInformationRepository venueInformationRepository) {
        this.venueInformationRepository = venueInformationRepository;
    }

    /**
     * {@code POST  /venue-informations} : Create a new venueInformation.
     *
     * @param venueInformation the venueInformation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new venueInformation, or with status {@code 400 (Bad Request)} if the venueInformation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/venue-informations")
    public ResponseEntity<VenueInformation> createVenueInformation(@RequestBody VenueInformation venueInformation)
        throws URISyntaxException {
        log.debug("REST request to save VenueInformation : {}", venueInformation);
        if (venueInformation.getId() != null) {
            throw new BadRequestAlertException("A new venueInformation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VenueInformation result = venueInformationRepository.save(venueInformation);
        return ResponseEntity
            .created(new URI("/api/venue-informations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /venue-informations/:id} : Updates an existing venueInformation.
     *
     * @param id the id of the venueInformation to save.
     * @param venueInformation the venueInformation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated venueInformation,
     * or with status {@code 400 (Bad Request)} if the venueInformation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the venueInformation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/venue-informations/{id}")
    public ResponseEntity<VenueInformation> updateVenueInformation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VenueInformation venueInformation
    ) throws URISyntaxException {
        log.debug("REST request to update VenueInformation : {}, {}", id, venueInformation);
        if (venueInformation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, venueInformation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!venueInformationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        VenueInformation result = venueInformationRepository.save(venueInformation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, venueInformation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /venue-informations/:id} : Partial updates given fields of an existing venueInformation, field will ignore if it is null
     *
     * @param id the id of the venueInformation to save.
     * @param venueInformation the venueInformation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated venueInformation,
     * or with status {@code 400 (Bad Request)} if the venueInformation is not valid,
     * or with status {@code 404 (Not Found)} if the venueInformation is not found,
     * or with status {@code 500 (Internal Server Error)} if the venueInformation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/venue-informations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VenueInformation> partialUpdateVenueInformation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody VenueInformation venueInformation
    ) throws URISyntaxException {
        log.debug("REST request to partial update VenueInformation partially : {}, {}", id, venueInformation);
        if (venueInformation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, venueInformation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!venueInformationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VenueInformation> result = venueInformationRepository
            .findById(venueInformation.getId())
            .map(existingVenueInformation -> {
                if (venueInformation.getName() != null) {
                    existingVenueInformation.setName(venueInformation.getName());
                }
                if (venueInformation.getPrice() != null) {
                    existingVenueInformation.setPrice(venueInformation.getPrice());
                }
                if (venueInformation.getCapacity() != null) {
                    existingVenueInformation.setCapacity(venueInformation.getCapacity());
                }
                if (venueInformation.getLocation() != null) {
                    existingVenueInformation.setLocation(venueInformation.getLocation());
                }
                if (venueInformation.getOpeningTimeFrom() != null) {
                    existingVenueInformation.setOpeningTimeFrom(venueInformation.getOpeningTimeFrom());
                }
                if (venueInformation.getOpeningTimeUntil() != null) {
                    existingVenueInformation.setOpeningTimeUntil(venueInformation.getOpeningTimeUntil());
                }
                if (venueInformation.getPicture() != null) {
                    existingVenueInformation.setPicture(venueInformation.getPicture());
                }
                if (venueInformation.getPictureContentType() != null) {
                    existingVenueInformation.setPictureContentType(venueInformation.getPictureContentType());
                }

                return existingVenueInformation;
            })
            .map(venueInformationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, venueInformation.getId().toString())
        );
    }

    /**
     * {@code GET  /venue-informations} : get all the venueInformations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of venueInformations in body.
     */
    @GetMapping("/venue-informations")
    public List<VenueInformation> getAllVenueInformations() {
        log.debug("REST request to get all VenueInformations");
        return venueInformationRepository.findAll();
    }

    /**
     * {@code GET  /venue-informations/:id} : get the "id" venueInformation.
     *
     * @param id the id of the venueInformation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the venueInformation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/venue-informations/{id}")
    public ResponseEntity<VenueInformation> getVenueInformation(@PathVariable Long id) {
        log.debug("REST request to get VenueInformation : {}", id);
        Optional<VenueInformation> venueInformation = venueInformationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(venueInformation);
    }

    /**
     * {@code DELETE  /venue-informations/:id} : delete the "id" venueInformation.
     *
     * @param id the id of the venueInformation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/venue-informations/{id}")
    public ResponseEntity<Void> deleteVenueInformation(@PathVariable Long id) {
        log.debug("REST request to delete VenueInformation : {}", id);
        venueInformationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
