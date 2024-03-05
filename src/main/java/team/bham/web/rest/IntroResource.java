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
import team.bham.domain.Intro;
import team.bham.repository.IntroRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Intro}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class IntroResource {

    private final Logger log = LoggerFactory.getLogger(IntroResource.class);

    private static final String ENTITY_NAME = "intro";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IntroRepository introRepository;

    public IntroResource(IntroRepository introRepository) {
        this.introRepository = introRepository;
    }

    /**
     * {@code POST  /intros} : Create a new intro.
     *
     * @param intro the intro to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new intro, or with status {@code 400 (Bad Request)} if the intro has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/intros")
    public ResponseEntity<Intro> createIntro(@Valid @RequestBody Intro intro) throws URISyntaxException {
        log.debug("REST request to save Intro : {}", intro);
        if (intro.getId() != null) {
            throw new BadRequestAlertException("A new intro cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Intro result = introRepository.save(intro);
        return ResponseEntity
            .created(new URI("/api/intros/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /intros/:id} : Updates an existing intro.
     *
     * @param id the id of the intro to save.
     * @param intro the intro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated intro,
     * or with status {@code 400 (Bad Request)} if the intro is not valid,
     * or with status {@code 500 (Internal Server Error)} if the intro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/intros/{id}")
    public ResponseEntity<Intro> updateIntro(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Intro intro)
        throws URISyntaxException {
        log.debug("REST request to update Intro : {}, {}", id, intro);
        if (intro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, intro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!introRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Intro result = introRepository.save(intro);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, intro.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /intros/:id} : Partial updates given fields of an existing intro, field will ignore if it is null
     *
     * @param id the id of the intro to save.
     * @param intro the intro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated intro,
     * or with status {@code 400 (Bad Request)} if the intro is not valid,
     * or with status {@code 404 (Not Found)} if the intro is not found,
     * or with status {@code 500 (Internal Server Error)} if the intro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/intros/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Intro> partialUpdateIntro(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Intro intro
    ) throws URISyntaxException {
        log.debug("REST request to partial update Intro partially : {}, {}", id, intro);
        if (intro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, intro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!introRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Intro> result = introRepository
            .findById(intro.getId())
            .map(existingIntro -> {
                if (intro.getTitle() != null) {
                    existingIntro.setTitle(intro.getTitle());
                }
                if (intro.getSalutation() != null) {
                    existingIntro.setSalutation(intro.getSalutation());
                }
                if (intro.getBody() != null) {
                    existingIntro.setBody(intro.getBody());
                }

                return existingIntro;
            })
            .map(introRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, intro.getId().toString())
        );
    }

    /**
     * {@code GET  /intros} : get all the intros.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of intros in body.
     */
    @GetMapping("/intros")
    public List<Intro> getAllIntros() {
        log.debug("REST request to get all Intros");
        return introRepository.findAll();
    }

    /**
     * {@code GET  /intros/:id} : get the "id" intro.
     *
     * @param id the id of the intro to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the intro, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/intros/{id}")
    public ResponseEntity<Intro> getIntro(@PathVariable Long id) {
        log.debug("REST request to get Intro : {}", id);
        Optional<Intro> intro = introRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(intro);
    }

    /**
     * {@code DELETE  /intros/:id} : delete the "id" intro.
     *
     * @param id the id of the intro to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/intros/{id}")
    public ResponseEntity<Void> deleteIntro(@PathVariable Long id) {
        log.debug("REST request to delete Intro : {}", id);
        introRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
