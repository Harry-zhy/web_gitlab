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
import team.bham.domain.DecoBudget;
import team.bham.repository.DecoBudgetRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DecoBudget}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecoBudgetResource {

    private final Logger log = LoggerFactory.getLogger(DecoBudgetResource.class);

    private static final String ENTITY_NAME = "decoBudget";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecoBudgetRepository decoBudgetRepository;

    public DecoBudgetResource(DecoBudgetRepository decoBudgetRepository) {
        this.decoBudgetRepository = decoBudgetRepository;
    }

    /**
     * {@code POST  /deco-budgets} : Create a new decoBudget.
     *
     * @param decoBudget the decoBudget to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decoBudget, or with status {@code 400 (Bad Request)} if the decoBudget has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deco-budgets")
    public ResponseEntity<DecoBudget> createDecoBudget(@RequestBody DecoBudget decoBudget) throws URISyntaxException {
        log.debug("REST request to save DecoBudget : {}", decoBudget);
        if (decoBudget.getId() != null) {
            throw new BadRequestAlertException("A new decoBudget cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DecoBudget result = decoBudgetRepository.save(decoBudget);
        return ResponseEntity
            .created(new URI("/api/deco-budgets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deco-budgets/:id} : Updates an existing decoBudget.
     *
     * @param id the id of the decoBudget to save.
     * @param decoBudget the decoBudget to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoBudget,
     * or with status {@code 400 (Bad Request)} if the decoBudget is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decoBudget couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deco-budgets/{id}")
    public ResponseEntity<DecoBudget> updateDecoBudget(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoBudget decoBudget
    ) throws URISyntaxException {
        log.debug("REST request to update DecoBudget : {}, {}", id, decoBudget);
        if (decoBudget.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoBudget.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoBudgetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DecoBudget result = decoBudgetRepository.save(decoBudget);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoBudget.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deco-budgets/:id} : Partial updates given fields of an existing decoBudget, field will ignore if it is null
     *
     * @param id the id of the decoBudget to save.
     * @param decoBudget the decoBudget to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoBudget,
     * or with status {@code 400 (Bad Request)} if the decoBudget is not valid,
     * or with status {@code 404 (Not Found)} if the decoBudget is not found,
     * or with status {@code 500 (Internal Server Error)} if the decoBudget couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deco-budgets/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DecoBudget> partialUpdateDecoBudget(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DecoBudget decoBudget
    ) throws URISyntaxException {
        log.debug("REST request to partial update DecoBudget partially : {}, {}", id, decoBudget);
        if (decoBudget.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoBudget.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoBudgetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DecoBudget> result = decoBudgetRepository
            .findById(decoBudget.getId())
            .map(existingDecoBudget -> {
                if (decoBudget.getMoney() != null) {
                    existingDecoBudget.setMoney(decoBudget.getMoney());
                }

                return existingDecoBudget;
            })
            .map(decoBudgetRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoBudget.getId().toString())
        );
    }

    /**
     * {@code GET  /deco-budgets} : get all the decoBudgets.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decoBudgets in body.
     */
    @GetMapping("/deco-budgets")
    public List<DecoBudget> getAllDecoBudgets(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all DecoBudgets");
        if (eagerload) {
            return decoBudgetRepository.findAllWithEagerRelationships();
        } else {
            return decoBudgetRepository.findAll();
        }
    }

    /**
     * {@code GET  /deco-budgets/:id} : get the "id" decoBudget.
     *
     * @param id the id of the decoBudget to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decoBudget, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deco-budgets/{id}")
    public ResponseEntity<DecoBudget> getDecoBudget(@PathVariable Long id) {
        log.debug("REST request to get DecoBudget : {}", id);
        Optional<DecoBudget> decoBudget = decoBudgetRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(decoBudget);
    }

    /**
     * {@code DELETE  /deco-budgets/:id} : delete the "id" decoBudget.
     *
     * @param id the id of the decoBudget to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deco-budgets/{id}")
    public ResponseEntity<Void> deleteDecoBudget(@PathVariable Long id) {
        log.debug("REST request to delete DecoBudget : {}", id);
        decoBudgetRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
