package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import team.bham.domain.ActivityCompany;
import team.bham.domain.BookedActivity;
import team.bham.repository.ActivityCompanyRepository;
import team.bham.service.BookedActivityService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ActivityCompany}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivityCompanyResource {

    private final Logger log = LoggerFactory.getLogger(ActivityCompanyResource.class);

    private static final String ENTITY_NAME = "activityCompany";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivityCompanyRepository activityCompanyRepository;

    private final BookedActivityService bookedActivityService;

    public ActivityCompanyResource(ActivityCompanyRepository activityCompanyRepository, BookedActivityService bookedActivityService) {
        this.activityCompanyRepository = activityCompanyRepository;
        this.bookedActivityService = bookedActivityService;
    }

    /**
     * {@code POST  /activity-companies} : Create a new activityCompany.
     *
     * @param activityCompany the activityCompany to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activityCompany, or with status {@code 400 (Bad Request)} if the activityCompany has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-companies")
    public ResponseEntity<ActivityCompany> createActivityCompany(@Valid @RequestBody ActivityCompany activityCompany)
        throws URISyntaxException {
        log.debug("REST request to save ActivityCompany : {}", activityCompany);
        if (activityCompany.getId() != null) {
            throw new BadRequestAlertException("A new activityCompany cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActivityCompany result = activityCompanyRepository.save(activityCompany);
        return ResponseEntity
            .created(new URI("/api/activity-companies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-companies/:id} : Updates an existing activityCompany.
     *
     * @param id the id of the activityCompany to save.
     * @param activityCompany the activityCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityCompany,
     * or with status {@code 400 (Bad Request)} if the activityCompany is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activityCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activity-companies/{id}")
    public ResponseEntity<ActivityCompany> updateActivityCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ActivityCompany activityCompany
    ) throws URISyntaxException {
        log.debug("REST request to update ActivityCompany : {}, {}", id, activityCompany);
        if (activityCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActivityCompany result = activityCompanyRepository.save(activityCompany);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityCompany.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /activity-companies/:id} : Partial updates given fields of an existing activityCompany, field will ignore if it is null
     *
     * @param id the id of the activityCompany to save.
     * @param activityCompany the activityCompany to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityCompany,
     * or with status {@code 400 (Bad Request)} if the activityCompany is not valid,
     * or with status {@code 404 (Not Found)} if the activityCompany is not found,
     * or with status {@code 500 (Internal Server Error)} if the activityCompany couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activity-companies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActivityCompany> partialUpdateActivityCompany(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ActivityCompany activityCompany
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActivityCompany partially : {}, {}", id, activityCompany);
        if (activityCompany.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityCompany.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityCompanyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActivityCompany> result = activityCompanyRepository
            .findById(activityCompany.getId())
            .map(existingActivityCompany -> {
                if (activityCompany.getName() != null) {
                    existingActivityCompany.setName(activityCompany.getName());
                }
                if (activityCompany.getAbout() != null) {
                    existingActivityCompany.setAbout(activityCompany.getAbout());
                }

                return existingActivityCompany;
            })
            .map(activityCompanyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityCompany.getId().toString())
        );
    }

    /**
     * {@code GET  /activity-companies} : get all the activityCompanies.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activityCompanies in body.
     */
    @GetMapping("/activity-companies")
    public List<ActivityCompany> getAllActivityCompanies(@RequestParam(required = false) String filter) {
        if ("activitycontactdetails-is-null".equals(filter)) {
            log.debug("REST request to get all ActivityCompanys where activityContactDetails is null");
            return StreamSupport
                .stream(activityCompanyRepository.findAll().spliterator(), false)
                .filter(activityCompany -> activityCompany.getActivityContactDetails() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all ActivityCompanies");
        return activityCompanyRepository.findAll();
    }

    /**
     * {@code GET  /activity-companies} : get all the activityCompanies.
     *
     * @param activity the activity which filters the returned companies.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activityCompanies in body.
     */
    @GetMapping("/activity-companiesNames")
    public String[] getAllActivityCompaniesNames(@RequestParam BookedActivity activity) {
        List<ActivityCompany> companiesEntities = bookedActivityService.getcompaniesFromBookedActivity(activity);
        String[] names = new String[companiesEntities.size()];
        for (int i = 0; i < companiesEntities.size(); i++) {
            names[i] = companiesEntities.get(i).getName();
        }
        return names;
    }

    /**
     * {@code GET  /activity-companies/:id} : get the "id" activityCompany.
     *
     * @param id the id of the activityCompany to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activityCompany, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-companies/{id}")
    public ResponseEntity<ActivityCompany> getActivityCompany(@PathVariable Long id) {
        log.debug("REST request to get ActivityCompany : {}", id);
        Optional<ActivityCompany> activityCompany = activityCompanyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activityCompany);
    }

    /**
     * {@code DELETE  /activity-companies/:id} : delete the "id" activityCompany.
     *
     * @param id the id of the activityCompany to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-companies/{id}")
    public ResponseEntity<Void> deleteActivityCompany(@PathVariable Long id) {
        log.debug("REST request to delete ActivityCompany : {}", id);
        activityCompanyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
