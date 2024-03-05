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
import team.bham.domain.ActivityImage;
import team.bham.repository.ActivityImageRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.ActivityImage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivityImageResource {

    private final Logger log = LoggerFactory.getLogger(ActivityImageResource.class);

    private static final String ENTITY_NAME = "activityImage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivityImageRepository activityImageRepository;

    public ActivityImageResource(ActivityImageRepository activityImageRepository) {
        this.activityImageRepository = activityImageRepository;
    }

    /**
     * {@code POST  /activity-images} : Create a new activityImage.
     *
     * @param activityImage the activityImage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activityImage, or with status {@code 400 (Bad Request)} if the activityImage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-images")
    public ResponseEntity<ActivityImage> createActivityImage(@RequestBody ActivityImage activityImage) throws URISyntaxException {
        log.debug("REST request to save ActivityImage : {}", activityImage);
        if (activityImage.getId() != null) {
            throw new BadRequestAlertException("A new activityImage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActivityImage result = activityImageRepository.save(activityImage);
        return ResponseEntity
            .created(new URI("/api/activity-images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-images/:id} : Updates an existing activityImage.
     *
     * @param id the id of the activityImage to save.
     * @param activityImage the activityImage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityImage,
     * or with status {@code 400 (Bad Request)} if the activityImage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activityImage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activity-images/{id}")
    public ResponseEntity<ActivityImage> updateActivityImage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActivityImage activityImage
    ) throws URISyntaxException {
        log.debug("REST request to update ActivityImage : {}, {}", id, activityImage);
        if (activityImage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityImage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityImageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActivityImage result = activityImageRepository.save(activityImage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityImage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /activity-images/:id} : Partial updates given fields of an existing activityImage, field will ignore if it is null
     *
     * @param id the id of the activityImage to save.
     * @param activityImage the activityImage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityImage,
     * or with status {@code 400 (Bad Request)} if the activityImage is not valid,
     * or with status {@code 404 (Not Found)} if the activityImage is not found,
     * or with status {@code 500 (Internal Server Error)} if the activityImage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activity-images/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActivityImage> partialUpdateActivityImage(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ActivityImage activityImage
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActivityImage partially : {}, {}", id, activityImage);
        if (activityImage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityImage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityImageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActivityImage> result = activityImageRepository
            .findById(activityImage.getId())
            .map(existingActivityImage -> {
                if (activityImage.getPicture() != null) {
                    existingActivityImage.setPicture(activityImage.getPicture());
                }
                if (activityImage.getPictureContentType() != null) {
                    existingActivityImage.setPictureContentType(activityImage.getPictureContentType());
                }

                return existingActivityImage;
            })
            .map(activityImageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, activityImage.getId().toString())
        );
    }

    /**
     * {@code GET  /activity-images} : get all the activityImages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activityImages in body.
     */
    @GetMapping("/activity-images")
    public List<ActivityImage> getAllActivityImages() {
        log.debug("REST request to get all ActivityImages");
        return activityImageRepository.findAll();
    }

    /**
     * {@code GET  /activity-images/:id} : get the "id" activityImage.
     *
     * @param id the id of the activityImage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activityImage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-images/{id}")
    public ResponseEntity<ActivityImage> getActivityImage(@PathVariable Long id) {
        log.debug("REST request to get ActivityImage : {}", id);
        Optional<ActivityImage> activityImage = activityImageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activityImage);
    }

    /**
     * {@code DELETE  /activity-images/:id} : delete the "id" activityImage.
     *
     * @param id the id of the activityImage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-images/{id}")
    public ResponseEntity<Void> deleteActivityImage(@PathVariable Long id) {
        log.debug("REST request to delete ActivityImage : {}", id);
        activityImageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
