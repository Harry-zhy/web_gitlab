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
import team.bham.domain.DecoThemes;
import team.bham.repository.DecoThemesRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DecoThemes}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecoThemesResource {

    private final Logger log = LoggerFactory.getLogger(DecoThemesResource.class);

    private static final String ENTITY_NAME = "decoThemes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecoThemesRepository decoThemesRepository;

    public DecoThemesResource(DecoThemesRepository decoThemesRepository) {
        this.decoThemesRepository = decoThemesRepository;
    }

    /**
     * {@code POST  /deco-themes} : Create a new decoThemes.
     *
     * @param decoThemes the decoThemes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decoThemes, or with status {@code 400 (Bad Request)} if the decoThemes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deco-themes")
    public ResponseEntity<DecoThemes> createDecoThemes(@RequestBody DecoThemes decoThemes) throws URISyntaxException {
        log.debug("REST request to save DecoThemes : {}", decoThemes);
        if (decoThemes.getId() != null) {
            throw new BadRequestAlertException("A new decoThemes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DecoThemes result = decoThemesRepository.save(decoThemes);
        return ResponseEntity
            .created(new URI("/api/deco-themes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deco-themes/:id} : Updates an existing decoThemes.
     *
     * @param id the id of the decoThemes to save.
     * @param decoThemes the decoThemes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoThemes,
     * or with status {@code 400 (Bad Request)} if the decoThemes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decoThemes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deco-themes/{id}")
    public ResponseEntity<DecoThemes> updateDecoThemes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoThemes decoThemes
    ) throws URISyntaxException {
        log.debug("REST request to update DecoThemes : {}, {}", id, decoThemes);
        if (decoThemes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoThemes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoThemesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DecoThemes result = decoThemesRepository.save(decoThemes);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoThemes.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deco-themes/:id} : Partial updates given fields of an existing decoThemes, field will ignore if it is null
     *
     * @param id the id of the decoThemes to save.
     * @param decoThemes the decoThemes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoThemes,
     * or with status {@code 400 (Bad Request)} if the decoThemes is not valid,
     * or with status {@code 404 (Not Found)} if the decoThemes is not found,
     * or with status {@code 500 (Internal Server Error)} if the decoThemes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deco-themes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DecoThemes> partialUpdateDecoThemes(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoThemes decoThemes
    ) throws URISyntaxException {
        log.debug("REST request to partial update DecoThemes partially : {}, {}", id, decoThemes);
        if (decoThemes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoThemes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoThemesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DecoThemes> result = decoThemesRepository
            .findById(decoThemes.getId())
            .map(existingDecoThemes -> {
                if (decoThemes.getDescription() != null) {
                    existingDecoThemes.setDescription(decoThemes.getDescription());
                }
                if (decoThemes.getName() != null) {
                    existingDecoThemes.setName(decoThemes.getName());
                }

                return existingDecoThemes;
            })
            .map(decoThemesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoThemes.getId().toString())
        );
    }

    /**
     * {@code GET  /deco-themes} : get all the decoThemes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decoThemes in body.
     */
    @GetMapping("/deco-themes")
    public List<DecoThemes> getAllDecoThemes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all DecoThemes");
        if (eagerload) {
            return decoThemesRepository.findAllWithEagerRelationships();
        } else {
            return decoThemesRepository.findAll();
        }
    }

    /**
     * {@code GET  /deco-themes/:id} : get the "id" decoThemes.
     *
     * @param id the id of the decoThemes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decoThemes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deco-themes/{id}")
    public ResponseEntity<DecoThemes> getDecoThemes(@PathVariable Long id) {
        log.debug("REST request to get DecoThemes : {}", id);
        Optional<DecoThemes> decoThemes = decoThemesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(decoThemes);
    }

    /**
     * {@code DELETE  /deco-themes/:id} : delete the "id" decoThemes.
     *
     * @param id the id of the decoThemes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deco-themes/{id}")
    public ResponseEntity<Void> deleteDecoThemes(@PathVariable Long id) {
        log.debug("REST request to delete DecoThemes : {}", id);
        decoThemesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
