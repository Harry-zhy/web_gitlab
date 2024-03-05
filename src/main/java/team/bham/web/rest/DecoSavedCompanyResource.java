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
import team.bham.domain.DecoSavedCompany;
import team.bham.repository.DecoSavedCompanyRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DecoSavedCompany}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecoSavedCompanyResource {

    private final Logger log = LoggerFactory.getLogger(DecoSavedCompanyResource.class);

    private static final String ENTITY_NAME = "decoSavedCompany";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecoSavedCompanyRepository decoSavedCompanyRepository;

    public DecoSavedCompanyResource(DecoSavedCompanyRepository decoSavedCompanyRepository) {
        this.decoSavedCompanyRepository = decoSavedCompanyRepository;
    }

    /**
     * {@code POST  /deco-saved-companies} : Create a new decoSavedCompany.
     *
     * @param decoSavedCompany the decoSavedCompany to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decoSavedCompany, or with status {@code 400 (Bad Request)} if the decoSavedCompany has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deco-saved-companies")
    public ResponseEntity<DecoSavedCompany> createDecoSavedCompany(@RequestBody DecoSavedCompany decoSavedCompany)
        throws URISyntaxException {
        log.debug("REST request to save DecoSavedCompany : {}", decoSavedCompany);
        if (decoSavedCompany.getId() != null) {
            throw new BadRequestAlertException("A new decoSavedCompany cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DecoSavedCompany result = decoSavedCompanyRepository.save(decoSavedCompany);
        return ResponseEntity
            .created(new URI("/api/deco-saved-companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deco-saved-companies/:id} : Updates an existing decoSavedCompany.
     *
     * @param id the id of the decoSavedCompany to save.
     * @param decoSavedCompany the decoSavedCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoSavedCompany,
     * or with status {@code 400 (Bad Request)} if the decoSavedCompany is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decoSavedCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deco-saved-companies/{id}")
    public ResponseEntity<DecoSavedCompany> updateDecoSavedCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoSavedCompany decoSavedCompany
    ) throws URISyntaxException {
        log.debug("REST request to update DecoSavedCompany : {}, {}", id, decoSavedCompany);
        if (decoSavedCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoSavedCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoSavedCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DecoSavedCompany result = decoSavedCompanyRepository.save(decoSavedCompany);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoSavedCompany.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deco-saved-companies/:id} : Partial updates given fields of an existing decoSavedCompany, field will ignore if it is null
     *
     * @param id the id of the decoSavedCompany to save.
     * @param decoSavedCompany the decoSavedCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoSavedCompany,
     * or with status {@code 400 (Bad Request)} if the decoSavedCompany is not valid,
     * or with status {@code 404 (Not Found)} if the decoSavedCompany is not found,
     * or with status {@code 500 (Internal Server Error)} if the decoSavedCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deco-saved-companies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DecoSavedCompany> partialUpdateDecoSavedCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoSavedCompany decoSavedCompany
    ) throws URISyntaxException {
        log.debug("REST request to partial update DecoSavedCompany partially : {}, {}", id, decoSavedCompany);
        if (decoSavedCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoSavedCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoSavedCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DecoSavedCompany> result = decoSavedCompanyRepository
            .findById(decoSavedCompany.getId())
            .map(existingDecoSavedCompany -> {
                if (decoSavedCompany.getName() != null) {
                    existingDecoSavedCompany.setName(decoSavedCompany.getName());
                }

                return existingDecoSavedCompany;
            })
            .map(decoSavedCompanyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoSavedCompany.getId().toString())
        );
    }

    /**
     * {@code GET  /deco-saved-companies} : get all the decoSavedCompanies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decoSavedCompanies in body.
     */
    @GetMapping("/deco-saved-companies")
    public List<DecoSavedCompany> getAllDecoSavedCompanies() {
        log.debug("REST request to get all DecoSavedCompanies");
        return decoSavedCompanyRepository.findAll();
    }

    /**
     * {@code GET  /deco-saved-companies/:id} : get the "id" decoSavedCompany.
     *
     * @param id the id of the decoSavedCompany to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decoSavedCompany, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deco-saved-companies/{id}")
    public ResponseEntity<DecoSavedCompany> getDecoSavedCompany(@PathVariable Long id) {
        log.debug("REST request to get DecoSavedCompany : {}", id);
        Optional<DecoSavedCompany> decoSavedCompany = decoSavedCompanyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(decoSavedCompany);
    }

    /**
     * {@code DELETE  /deco-saved-companies/:id} : delete the "id" decoSavedCompany.
     *
     * @param id the id of the decoSavedCompany to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deco-saved-companies/{id}")
    public ResponseEntity<Void> deleteDecoSavedCompany(@PathVariable Long id) {
        log.debug("REST request to delete DecoSavedCompany : {}", id);
        decoSavedCompanyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
