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
import team.bham.domain.AdsManagement;
import team.bham.repository.AdsManagementRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.AdsManagement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AdsManagementResource {

    private final Logger log = LoggerFactory.getLogger(AdsManagementResource.class);

    private static final String ENTITY_NAME = "adsManagement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdsManagementRepository adsManagementRepository;

    public AdsManagementResource(AdsManagementRepository adsManagementRepository) {
        this.adsManagementRepository = adsManagementRepository;
    }

    /**
     * {@code POST  /ads-managements} : Create a new adsManagement.
     *
     * @param adsManagement the adsManagement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new adsManagement, or with status {@code 400 (Bad Request)} if the adsManagement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ads-managements")
    public ResponseEntity<AdsManagement> createAdsManagement(@RequestBody AdsManagement adsManagement) throws URISyntaxException {
        log.debug("REST request to save AdsManagement : {}", adsManagement);
        if (adsManagement.getId() != null) {
            throw new BadRequestAlertException("A new adsManagement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AdsManagement result = adsManagementRepository.save(adsManagement);
        return ResponseEntity
            .created(new URI("/api/ads-managements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ads-managements/:id} : Updates an existing adsManagement.
     *
     * @param id the id of the adsManagement to save.
     * @param adsManagement the adsManagement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adsManagement,
     * or with status {@code 400 (Bad Request)} if the adsManagement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the adsManagement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ads-managements/{id}")
    public ResponseEntity<AdsManagement> updateAdsManagement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AdsManagement adsManagement
    ) throws URISyntaxException {
        log.debug("REST request to update AdsManagement : {}, {}", id, adsManagement);
        if (adsManagement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adsManagement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adsManagementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AdsManagement result = adsManagementRepository.save(adsManagement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adsManagement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ads-managements/:id} : Partial updates given fields of an existing adsManagement, field will ignore if it is null
     *
     * @param id the id of the adsManagement to save.
     * @param adsManagement the adsManagement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adsManagement,
     * or with status {@code 400 (Bad Request)} if the adsManagement is not valid,
     * or with status {@code 404 (Not Found)} if the adsManagement is not found,
     * or with status {@code 500 (Internal Server Error)} if the adsManagement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ads-managements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AdsManagement> partialUpdateAdsManagement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AdsManagement adsManagement
    ) throws URISyntaxException {
        log.debug("REST request to partial update AdsManagement partially : {}, {}", id, adsManagement);
        if (adsManagement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adsManagement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adsManagementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdsManagement> result = adsManagementRepository
            .findById(adsManagement.getId())
            .map(existingAdsManagement -> {
                if (adsManagement.getAge() != null) {
                    existingAdsManagement.setAge(adsManagement.getAge());
                }
                if (adsManagement.getGender() != null) {
                    existingAdsManagement.setGender(adsManagement.getGender());
                }
                if (adsManagement.getPreference() != null) {
                    existingAdsManagement.setPreference(adsManagement.getPreference());
                }
                if (adsManagement.getLocation() != null) {
                    existingAdsManagement.setLocation(adsManagement.getLocation());
                }

                return existingAdsManagement;
            })
            .map(adsManagementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adsManagement.getId().toString())
        );
    }

    /**
     * {@code GET  /ads-managements} : get all the adsManagements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of adsManagements in body.
     */
    @GetMapping("/ads-managements")
    public List<AdsManagement> getAllAdsManagements() {
        log.debug("REST request to get all AdsManagements");
        return adsManagementRepository.findAll();
    }

    /**
     * {@code GET  /ads-managements/:id} : get the "id" adsManagement.
     *
     * @param id the id of the adsManagement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the adsManagement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ads-managements/{id}")
    public ResponseEntity<AdsManagement> getAdsManagement(@PathVariable Long id) {
        log.debug("REST request to get AdsManagement : {}", id);
        Optional<AdsManagement> adsManagement = adsManagementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(adsManagement);
    }

    /**
     * {@code DELETE  /ads-managements/:id} : delete the "id" adsManagement.
     *
     * @param id the id of the adsManagement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ads-managements/{id}")
    public ResponseEntity<Void> deleteAdsManagement(@PathVariable Long id) {
        log.debug("REST request to delete AdsManagement : {}", id);
        adsManagementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
