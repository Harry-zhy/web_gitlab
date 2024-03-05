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
import team.bham.domain.DecoSavedTheme;
import team.bham.repository.DecoSavedThemeRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DecoSavedTheme}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecoSavedThemeResource {

    private final Logger log = LoggerFactory.getLogger(DecoSavedThemeResource.class);

    private static final String ENTITY_NAME = "decoSavedTheme";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecoSavedThemeRepository decoSavedThemeRepository;

    public DecoSavedThemeResource(DecoSavedThemeRepository decoSavedThemeRepository) {
        this.decoSavedThemeRepository = decoSavedThemeRepository;
    }

    /**
     * {@code POST  /deco-saved-themes} : Create a new decoSavedTheme.
     *
     * @param decoSavedTheme the decoSavedTheme to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decoSavedTheme, or with status {@code 400 (Bad Request)} if the decoSavedTheme has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deco-saved-themes")
    public ResponseEntity<DecoSavedTheme> createDecoSavedTheme(@RequestBody DecoSavedTheme decoSavedTheme) throws URISyntaxException {
        log.debug("REST request to save DecoSavedTheme : {}", decoSavedTheme);
        if (decoSavedTheme.getId() != null) {
            throw new BadRequestAlertException("A new decoSavedTheme cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DecoSavedTheme result = decoSavedThemeRepository.save(decoSavedTheme);
        return ResponseEntity
            .created(new URI("/api/deco-saved-themes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deco-saved-themes/:id} : Updates an existing decoSavedTheme.
     *
     * @param id the id of the decoSavedTheme to save.
     * @param decoSavedTheme the decoSavedTheme to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoSavedTheme,
     * or with status {@code 400 (Bad Request)} if the decoSavedTheme is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decoSavedTheme couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deco-saved-themes/{id}")
    public ResponseEntity<DecoSavedTheme> updateDecoSavedTheme(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoSavedTheme decoSavedTheme
    ) throws URISyntaxException {
        log.debug("REST request to update DecoSavedTheme : {}, {}", id, decoSavedTheme);
        if (decoSavedTheme.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoSavedTheme.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoSavedThemeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DecoSavedTheme result = decoSavedThemeRepository.save(decoSavedTheme);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoSavedTheme.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deco-saved-themes/:id} : Partial updates given fields of an existing decoSavedTheme, field will ignore if it is null
     *
     * @param id the id of the decoSavedTheme to save.
     * @param decoSavedTheme the decoSavedTheme to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoSavedTheme,
     * or with status {@code 400 (Bad Request)} if the decoSavedTheme is not valid,
     * or with status {@code 404 (Not Found)} if the decoSavedTheme is not found,
     * or with status {@code 500 (Internal Server Error)} if the decoSavedTheme couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deco-saved-themes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DecoSavedTheme> partialUpdateDecoSavedTheme(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoSavedTheme decoSavedTheme
    ) throws URISyntaxException {
        log.debug("REST request to partial update DecoSavedTheme partially : {}, {}", id, decoSavedTheme);
        if (decoSavedTheme.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoSavedTheme.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoSavedThemeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DecoSavedTheme> result = decoSavedThemeRepository
            .findById(decoSavedTheme.getId())
            .map(existingDecoSavedTheme -> {
                if (decoSavedTheme.getName() != null) {
                    existingDecoSavedTheme.setName(decoSavedTheme.getName());
                }

                return existingDecoSavedTheme;
            })
            .map(decoSavedThemeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoSavedTheme.getId().toString())
        );
    }

    /**
     * {@code GET  /deco-saved-themes} : get all the decoSavedThemes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decoSavedThemes in body.
     */
    @GetMapping("/deco-saved-themes")
    public List<DecoSavedTheme> getAllDecoSavedThemes() {
        log.debug("REST request to get all DecoSavedThemes");
        return decoSavedThemeRepository.findAll();
    }

    /**
     * {@code GET  /deco-saved-themes/:id} : get the "id" decoSavedTheme.
     *
     * @param id the id of the decoSavedTheme to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decoSavedTheme, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deco-saved-themes/{id}")
    public ResponseEntity<DecoSavedTheme> getDecoSavedTheme(@PathVariable Long id) {
        log.debug("REST request to get DecoSavedTheme : {}", id);
        Optional<DecoSavedTheme> decoSavedTheme = decoSavedThemeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(decoSavedTheme);
    }

    /**
     * {@code DELETE  /deco-saved-themes/:id} : delete the "id" decoSavedTheme.
     *
     * @param id the id of the decoSavedTheme to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deco-saved-themes/{id}")
    public ResponseEntity<Void> deleteDecoSavedTheme(@PathVariable Long id) {
        log.debug("REST request to delete DecoSavedTheme : {}", id);
        decoSavedThemeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
