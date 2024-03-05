package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.DecoContactDetails;
import team.bham.repository.DecoContactDetailsRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DecoContactDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecoContactDetailsResource {

    private final Logger log = LoggerFactory.getLogger(DecoContactDetailsResource.class);

    private static final String ENTITY_NAME = "decoContactDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecoContactDetailsRepository decoContactDetailsRepository;

    public DecoContactDetailsResource(DecoContactDetailsRepository decoContactDetailsRepository) {
        this.decoContactDetailsRepository = decoContactDetailsRepository;
    }

    /**
     * {@code POST  /deco-contact-details} : Create a new decoContactDetails.
     *
     * @param decoContactDetails the decoContactDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decoContactDetails, or with status {@code 400 (Bad Request)} if the decoContactDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deco-contact-details")
    public ResponseEntity<DecoContactDetails> createDecoContactDetails(@RequestBody DecoContactDetails decoContactDetails)
        throws URISyntaxException {
        log.debug("REST request to save DecoContactDetails : {}", decoContactDetails);
        if (decoContactDetails.getId() != null) {
            throw new BadRequestAlertException("A new decoContactDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DecoContactDetails result = decoContactDetailsRepository.save(decoContactDetails);
        return ResponseEntity
            .created(new URI("/api/deco-contact-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deco-contact-details/:id} : Updates an existing decoContactDetails.
     *
     * @param id the id of the decoContactDetails to save.
     * @param decoContactDetails the decoContactDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoContactDetails,
     * or with status {@code 400 (Bad Request)} if the decoContactDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decoContactDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deco-contact-details/{id}")
    public ResponseEntity<DecoContactDetails> updateDecoContactDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoContactDetails decoContactDetails
    ) throws URISyntaxException {
        log.debug("REST request to update DecoContactDetails : {}, {}", id, decoContactDetails);
        if (decoContactDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoContactDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoContactDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DecoContactDetails result = decoContactDetailsRepository.save(decoContactDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoContactDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deco-contact-details/:id} : Partial updates given fields of an existing decoContactDetails, field will ignore if it is null
     *
     * @param id the id of the decoContactDetails to save.
     * @param decoContactDetails the decoContactDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoContactDetails,
     * or with status {@code 400 (Bad Request)} if the decoContactDetails is not valid,
     * or with status {@code 404 (Not Found)} if the decoContactDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the decoContactDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deco-contact-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DecoContactDetails> partialUpdateDecoContactDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoContactDetails decoContactDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update DecoContactDetails partially : {}, {}", id, decoContactDetails);
        if (decoContactDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoContactDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoContactDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DecoContactDetails> result = decoContactDetailsRepository
            .findById(decoContactDetails.getId())
            .map(existingDecoContactDetails -> {
                if (decoContactDetails.getWebsite() != null) {
                    existingDecoContactDetails.setWebsite(decoContactDetails.getWebsite());
                }
                if (decoContactDetails.getPhoneNumber() != null) {
                    existingDecoContactDetails.setPhoneNumber(decoContactDetails.getPhoneNumber());
                }
                if (decoContactDetails.getInstagram() != null) {
                    existingDecoContactDetails.setInstagram(decoContactDetails.getInstagram());
                }
                if (decoContactDetails.getTwitter() != null) {
                    existingDecoContactDetails.setTwitter(decoContactDetails.getTwitter());
                }
                if (decoContactDetails.getFacebook() != null) {
                    existingDecoContactDetails.setFacebook(decoContactDetails.getFacebook());
                }
                if (decoContactDetails.getTiktok() != null) {
                    existingDecoContactDetails.setTiktok(decoContactDetails.getTiktok());
                }

                return existingDecoContactDetails;
            })
            .map(decoContactDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoContactDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /deco-contact-details} : get all the decoContactDetails.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decoContactDetails in body.
     */
    @GetMapping("/deco-contact-details")
    public List<DecoContactDetails> getAllDecoContactDetails(@RequestParam(required = false) String filter) {
        if ("decocompany-is-null".equals(filter)) {
            log.debug("REST request to get all DecoContactDetailss where decoCompany is null");
            return StreamSupport
                .stream(decoContactDetailsRepository.findAll().spliterator(), false)
                .filter(decoContactDetails -> decoContactDetails.getDecoCompany() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all DecoContactDetails");
        return decoContactDetailsRepository.findAll();
    }

    /**
     * {@code GET  /deco-contact-details/:id} : get the "id" decoContactDetails.
     *
     * @param id the id of the decoContactDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decoContactDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deco-contact-details/{id}")
    public ResponseEntity<DecoContactDetails> getDecoContactDetails(@PathVariable Long id) {
        log.debug("REST request to get DecoContactDetails : {}", id);
        Optional<DecoContactDetails> decoContactDetails = decoContactDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(decoContactDetails);
    }

    /**
     * {@code DELETE  /deco-contact-details/:id} : delete the "id" decoContactDetails.
     *
     * @param id the id of the decoContactDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deco-contact-details/{id}")
    public ResponseEntity<Void> deleteDecoContactDetails(@PathVariable Long id) {
        log.debug("REST request to delete DecoContactDetails : {}", id);
        decoContactDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
