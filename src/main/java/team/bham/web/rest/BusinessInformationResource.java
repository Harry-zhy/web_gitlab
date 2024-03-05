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
import team.bham.domain.BusinessInformation;
import team.bham.repository.BusinessInformationRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.BusinessInformation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BusinessInformationResource {

    private final Logger log = LoggerFactory.getLogger(BusinessInformationResource.class);

    private static final String ENTITY_NAME = "businessInformation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BusinessInformationRepository businessInformationRepository;

    public BusinessInformationResource(BusinessInformationRepository businessInformationRepository) {
        this.businessInformationRepository = businessInformationRepository;
    }

    /**
     * {@code POST  /business-informations} : Create a new businessInformation.
     *
     * @param businessInformation the businessInformation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new businessInformation, or with status {@code 400 (Bad Request)} if the businessInformation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/business-informations")
    public ResponseEntity<BusinessInformation> createBusinessInformation(@RequestBody BusinessInformation businessInformation)
        throws URISyntaxException {
        log.debug("REST request to save BusinessInformation : {}", businessInformation);
        if (businessInformation.getId() != null) {
            throw new BadRequestAlertException("A new businessInformation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BusinessInformation result = businessInformationRepository.save(businessInformation);
        return ResponseEntity
            .created(new URI("/api/business-informations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /business-informations/:id} : Updates an existing businessInformation.
     *
     * @param id the id of the businessInformation to save.
     * @param businessInformation the businessInformation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessInformation,
     * or with status {@code 400 (Bad Request)} if the businessInformation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the businessInformation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/business-informations/{id}")
    public ResponseEntity<BusinessInformation> updateBusinessInformation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BusinessInformation businessInformation
    ) throws URISyntaxException {
        log.debug("REST request to update BusinessInformation : {}, {}", id, businessInformation);
        if (businessInformation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessInformation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!businessInformationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BusinessInformation result = businessInformationRepository.save(businessInformation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, businessInformation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /business-informations/:id} : Partial updates given fields of an existing businessInformation, field will ignore if it is null
     *
     * @param id the id of the businessInformation to save.
     * @param businessInformation the businessInformation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessInformation,
     * or with status {@code 400 (Bad Request)} if the businessInformation is not valid,
     * or with status {@code 404 (Not Found)} if the businessInformation is not found,
     * or with status {@code 500 (Internal Server Error)} if the businessInformation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/business-informations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BusinessInformation> partialUpdateBusinessInformation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BusinessInformation businessInformation
    ) throws URISyntaxException {
        log.debug("REST request to partial update BusinessInformation partially : {}, {}", id, businessInformation);
        if (businessInformation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessInformation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!businessInformationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BusinessInformation> result = businessInformationRepository
            .findById(businessInformation.getId())
            .map(existingBusinessInformation -> {
                if (businessInformation.getInformation() != null) {
                    existingBusinessInformation.setInformation(businessInformation.getInformation());
                }
                if (businessInformation.getBusinessHours() != null) {
                    existingBusinessInformation.setBusinessHours(businessInformation.getBusinessHours());
                }
                if (businessInformation.getSpecialServicesAvailable() != null) {
                    existingBusinessInformation.setSpecialServicesAvailable(businessInformation.getSpecialServicesAvailable());
                }

                return existingBusinessInformation;
            })
            .map(businessInformationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, businessInformation.getId().toString())
        );
    }

    /**
     * {@code GET  /business-informations} : get all the businessInformations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businessInformations in body.
     */
    @GetMapping("/business-informations")
    public List<BusinessInformation> getAllBusinessInformations() {
        log.debug("REST request to get all BusinessInformations");
        return businessInformationRepository.findAll();
    }

    /**
     * {@code GET  /business-informations/:id} : get the "id" businessInformation.
     *
     * @param id the id of the businessInformation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the businessInformation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/business-informations/{id}")
    public ResponseEntity<BusinessInformation> getBusinessInformation(@PathVariable Long id) {
        log.debug("REST request to get BusinessInformation : {}", id);
        Optional<BusinessInformation> businessInformation = businessInformationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(businessInformation);
    }

    /**
     * {@code DELETE  /business-informations/:id} : delete the "id" businessInformation.
     *
     * @param id the id of the businessInformation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/business-informations/{id}")
    public ResponseEntity<Void> deleteBusinessInformation(@PathVariable Long id) {
        log.debug("REST request to delete BusinessInformation : {}", id);
        businessInformationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
