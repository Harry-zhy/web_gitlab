package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.DecoCompany;
import team.bham.repository.DecoCompanyRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DecoCompany}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecoCompanyResource {

    private final Logger log = LoggerFactory.getLogger(DecoCompanyResource.class);

    private static final String ENTITY_NAME = "decoCompany";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecoCompanyRepository decoCompanyRepository;

    public DecoCompanyResource(DecoCompanyRepository decoCompanyRepository) {
        this.decoCompanyRepository = decoCompanyRepository;
    }

    /**
     * {@code POST  /deco-companies} : Create a new decoCompany.
     *
     * @param decoCompany the decoCompany to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decoCompany, or with status {@code 400 (Bad Request)} if the decoCompany has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deco-companies")
    public ResponseEntity<DecoCompany> createDecoCompany(@Valid @RequestBody DecoCompany decoCompany) throws URISyntaxException {
        log.debug("REST request to save DecoCompany : {}", decoCompany);
        if (decoCompany.getId() != null) {
            throw new BadRequestAlertException("A new decoCompany cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DecoCompany result = decoCompanyRepository.save(decoCompany);
        return ResponseEntity
            .created(new URI("/api/deco-companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deco-companies/:id} : Updates an existing decoCompany.
     *
     * @param id the id of the decoCompany to save.
     * @param decoCompany the decoCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoCompany,
     * or with status {@code 400 (Bad Request)} if the decoCompany is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decoCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deco-companies/{id}")
    public ResponseEntity<DecoCompany> updateDecoCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DecoCompany decoCompany
    ) throws URISyntaxException {
        log.debug("REST request to update DecoCompany : {}, {}", id, decoCompany);
        if (decoCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DecoCompany result = decoCompanyRepository.save(decoCompany);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoCompany.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deco-companies/:id} : Partial updates given fields of an existing decoCompany, field will ignore if it is null
     *
     * @param id the id of the decoCompany to save.
     * @param decoCompany the decoCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoCompany,
     * or with status {@code 400 (Bad Request)} if the decoCompany is not valid,
     * or with status {@code 404 (Not Found)} if the decoCompany is not found,
     * or with status {@code 500 (Internal Server Error)} if the decoCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deco-companies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DecoCompany> partialUpdateDecoCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DecoCompany decoCompany
    ) throws URISyntaxException {
        log.debug("REST request to partial update DecoCompany partially : {}, {}", id, decoCompany);
        if (decoCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DecoCompany> result = decoCompanyRepository
            .findById(decoCompany.getId())
            .map(existingDecoCompany -> {
                if (decoCompany.getName() != null) {
                    existingDecoCompany.setName(decoCompany.getName());
                }
                if (decoCompany.getAbout() != null) {
                    existingDecoCompany.setAbout(decoCompany.getAbout());
                }
                if (decoCompany.getRating() != null) {
                    existingDecoCompany.setRating(decoCompany.getRating());
                }

                return existingDecoCompany;
            })
            .map(decoCompanyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoCompany.getId().toString())
        );
    }

    /**
     * {@code GET  /deco-companies} : get all the decoCompanies.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decoCompanies in body.
     */
    @GetMapping("/deco-companies")
    public List<DecoCompany> getAllDecoCompanies(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all DecoCompanies");
        if (eagerload) {
            return decoCompanyRepository.findAllWithEagerRelationships();
        } else {
            return decoCompanyRepository.findAll();
        }
    }

    /**
     * {@code GET  /deco-companies/:id} : get the "id" decoCompany.
     *
     * @param id the id of the decoCompany to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decoCompany, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deco-companies/{id}")
    public ResponseEntity<DecoCompany> getDecoCompany(@PathVariable Long id) {
        log.debug("REST request to get DecoCompany : {}", id);
        Optional<DecoCompany> decoCompany = decoCompanyRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(decoCompany);
    }

    /**
     * {@code DELETE  /deco-companies/:id} : delete the "id" decoCompany.
     *
     * @param id the id of the decoCompany to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deco-companies/{id}")
    public ResponseEntity<Void> deleteDecoCompany(@PathVariable Long id) {
        log.debug("REST request to delete DecoCompany : {}", id);
        decoCompanyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
