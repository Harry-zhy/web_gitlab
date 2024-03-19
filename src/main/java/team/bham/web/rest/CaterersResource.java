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
import team.bham.domain.Caterers;
import team.bham.repository.CaterersRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Caterers}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CaterersResource {

    private final Logger log = LoggerFactory.getLogger(CaterersResource.class);

    private static final String ENTITY_NAME = "src/main/webapp/app/caterers/caterers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CaterersRepository caterersRepository;

    public CaterersResource(CaterersRepository caterersRepository) {
        this.caterersRepository = caterersRepository;
    }

    /**
     * {@code POST  /caterers} : Create a new caterers.
     *
     * @param caterers the caterers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new caterers, or with status {@code 400 (Bad Request)} if the caterers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/caterers")
    public ResponseEntity<Caterers> createCaterers(@RequestBody Caterers caterers) throws URISyntaxException {
        log.debug("REST request to save Caterers : {}", caterers);
        if (caterers.getId() != null) {
            throw new BadRequestAlertException("A new caterers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Caterers result = caterersRepository.save(caterers);
        return ResponseEntity
            .created(new URI("/api/caterers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /caterers/:id} : Updates an existing caterers.
     *
     * @param id the id of the caterers to save.
     * @param caterers the caterers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caterers,
     * or with status {@code 400 (Bad Request)} if the caterers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the caterers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/caterers/{id}")
    public ResponseEntity<Caterers> updateCaterers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Caterers caterers
    ) throws URISyntaxException {
        log.debug("REST request to update Caterers : {}, {}", id, caterers);
        if (caterers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caterers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caterersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Caterers result = caterersRepository.save(caterers);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, caterers.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /caterers/:id} : Partial updates given fields of an existing caterers, field will ignore if it is null
     *
     * @param id the id of the caterers to save.
     * @param caterers the caterers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caterers,
     * or with status {@code 400 (Bad Request)} if the caterers is not valid,
     * or with status {@code 404 (Not Found)} if the caterers is not found,
     * or with status {@code 500 (Internal Server Error)} if the caterers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/caterers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Caterers> partialUpdateCaterers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Caterers caterers
    ) throws URISyntaxException {
        log.debug("REST request to partial update Caterers partially : {}, {}", id, caterers);
        if (caterers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caterers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caterersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Caterers> result = caterersRepository
            .findById(caterers.getId())
            .map(existingCaterers -> {
                if (caterers.getName() != null) {
                    existingCaterers.setName(caterers.getName());
                }
                if (caterers.getPicture() != null) {
                    existingCaterers.setPicture(caterers.getPicture());
                }
                if (caterers.getPictureContentType() != null) {
                    existingCaterers.setPictureContentType(caterers.getPictureContentType());
                }
                if (caterers.getPricePerPerson() != null) {
                    existingCaterers.setPricePerPerson(caterers.getPricePerPerson());
                }
                if (caterers.getGuestLimit() != null) {
                    existingCaterers.setGuestLimit(caterers.getGuestLimit());
                }

                return existingCaterers;
            })
            .map(caterersRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, caterers.getId().toString())
        );
    }

    /**
     * {@code GET  /caterers} : get all the caterers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of caterers in body.
     */
    @GetMapping("/caterers")
    public List<Caterers> getAllCaterers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Caterers");
        if (eagerload) {
            return caterersRepository.findAllWithEagerRelationships();
        } else {
            return caterersRepository.findAll();
        }
    }

    /**
     * {@code GET  /caterers/:id} : get the "id" caterers.
     *
     * @param id the id of the caterers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the caterers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/caterers/{id}")
    public ResponseEntity<Caterers> getCaterers(@PathVariable Long id) {
        log.debug("REST request to get Caterers : {}", id);
        Optional<Caterers> caterers = caterersRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(caterers);
    }

    /**
     * {@code DELETE  /caterers/:id} : delete the "id" caterers.
     *
     * @param id the id of the caterers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/caterers/{id}")
    public ResponseEntity<Void> deleteCaterers(@PathVariable Long id) {
        log.debug("REST request to delete Caterers : {}", id);
        caterersRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
