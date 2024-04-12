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
import team.bham.domain.MCQOption;
import team.bham.repository.MCQOptionRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.MCQOption}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MCQOptionResource {

    private final Logger log = LoggerFactory.getLogger(MCQOptionResource.class);

    private static final String ENTITY_NAME = "mCQOption";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MCQOptionRepository mCQOptionRepository;

    public MCQOptionResource(MCQOptionRepository mCQOptionRepository) {
        this.mCQOptionRepository = mCQOptionRepository;
    }

    /**
     * {@code POST  /mcq-options} : Create a new mCQOption.
     *
     * @param mCQOption the mCQOption to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mCQOption, or with status {@code 400 (Bad Request)} if the mCQOption has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/mcq-options")
    public ResponseEntity<MCQOption> createMCQOption(@Valid @RequestBody MCQOption mCQOption) throws URISyntaxException {
        log.debug("REST request to save MCQOption : {}", mCQOption);
        if (mCQOption.getId() != null) {
            throw new BadRequestAlertException("A new mCQOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MCQOption result = mCQOptionRepository.save(mCQOption);
        return ResponseEntity
            .created(new URI("/api/mcq-options/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /mcq-options/:id} : Updates an existing mCQOption.
     *
     * @param id the id of the mCQOption to save.
     * @param mCQOption the mCQOption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mCQOption,
     * or with status {@code 400 (Bad Request)} if the mCQOption is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mCQOption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/mcq-options/{id}")
    public ResponseEntity<MCQOption> updateMCQOption(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MCQOption mCQOption
    ) throws URISyntaxException {
        log.debug("REST request to update MCQOption : {}, {}", id, mCQOption);
        if (mCQOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mCQOption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mCQOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MCQOption result = mCQOptionRepository.save(mCQOption);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mCQOption.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /mcq-options/:id} : Partial updates given fields of an existing mCQOption, field will ignore if it is null
     *
     * @param id the id of the mCQOption to save.
     * @param mCQOption the mCQOption to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mCQOption,
     * or with status {@code 400 (Bad Request)} if the mCQOption is not valid,
     * or with status {@code 404 (Not Found)} if the mCQOption is not found,
     * or with status {@code 500 (Internal Server Error)} if the mCQOption couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/mcq-options/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MCQOption> partialUpdateMCQOption(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MCQOption mCQOption
    ) throws URISyntaxException {
        log.debug("REST request to partial update MCQOption partially : {}, {}", id, mCQOption);
        if (mCQOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mCQOption.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mCQOptionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MCQOption> result = mCQOptionRepository
            .findById(mCQOption.getId())
            .map(existingMCQOption -> {
                if (mCQOption.getOption() != null) {
                    existingMCQOption.setOption(mCQOption.getOption());
                }

                return existingMCQOption;
            })
            .map(mCQOptionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mCQOption.getId().toString())
        );
    }

    /**
     * {@code GET  /mcq-options} : get all the mCQOptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mCQOptions in body.
     */
    @GetMapping("/mcq-options")
    public List<MCQOption> getAllMCQOptions() {
        log.debug("REST request to get all MCQOptions");
        return mCQOptionRepository.findAll();
    }

    /**
     * {@code GET  /mcq-options/:id} : get the "id" mCQOption.
     *
     * @param id the id of the mCQOption to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mCQOption, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/mcq-options/{id}")
    public ResponseEntity<MCQOption> getMCQOption(@PathVariable Long id) {
        log.debug("REST request to get MCQOption : {}", id);
        Optional<MCQOption> mCQOption = mCQOptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(mCQOption);
    }

    /**
     * {@code DELETE  /mcq-options/:id} : delete the "id" mCQOption.
     *
     * @param id the id of the mCQOption to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/mcq-options/{id}")
    public ResponseEntity<Void> deleteMCQOption(@PathVariable Long id) {
        log.debug("REST request to delete MCQOption : {}", id);
        mCQOptionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
