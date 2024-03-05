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
import team.bham.domain.DecoImages;
import team.bham.repository.DecoImagesRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.DecoImages}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DecoImagesResource {

    private final Logger log = LoggerFactory.getLogger(DecoImagesResource.class);

    private static final String ENTITY_NAME = "decoImages";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DecoImagesRepository decoImagesRepository;

    public DecoImagesResource(DecoImagesRepository decoImagesRepository) {
        this.decoImagesRepository = decoImagesRepository;
    }

    /**
     * {@code POST  /deco-images} : Create a new decoImages.
     *
     * @param decoImages the decoImages to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new decoImages, or with status {@code 400 (Bad Request)} if the decoImages has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/deco-images")
    public ResponseEntity<DecoImages> createDecoImages(@Valid @RequestBody DecoImages decoImages) throws URISyntaxException {
        log.debug("REST request to save DecoImages : {}", decoImages);
        if (decoImages.getId() != null) {
            throw new BadRequestAlertException("A new decoImages cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DecoImages result = decoImagesRepository.save(decoImages);
        return ResponseEntity
            .created(new URI("/api/deco-images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /deco-images/:id} : Updates an existing decoImages.
     *
     * @param id the id of the decoImages to save.
     * @param decoImages the decoImages to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoImages,
     * or with status {@code 400 (Bad Request)} if the decoImages is not valid,
     * or with status {@code 500 (Internal Server Error)} if the decoImages couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/deco-images/{id}")
    public ResponseEntity<DecoImages> updateDecoImages(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DecoImages decoImages
    ) throws URISyntaxException {
        log.debug("REST request to update DecoImages : {}, {}", id, decoImages);
        if (decoImages.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoImages.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoImagesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DecoImages result = decoImagesRepository.save(decoImages);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoImages.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /deco-images/:id} : Partial updates given fields of an existing decoImages, field will ignore if it is null
     *
     * @param id the id of the decoImages to save.
     * @param decoImages the decoImages to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated decoImages,
     * or with status {@code 400 (Bad Request)} if the decoImages is not valid,
     * or with status {@code 404 (Not Found)} if the decoImages is not found,
     * or with status {@code 500 (Internal Server Error)} if the decoImages couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/deco-images/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DecoImages> partialUpdateDecoImages(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DecoImages decoImages
    ) throws URISyntaxException {
        log.debug("REST request to partial update DecoImages partially : {}, {}", id, decoImages);
        if (decoImages.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, decoImages.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!decoImagesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DecoImages> result = decoImagesRepository
            .findById(decoImages.getId())
            .map(existingDecoImages -> {
                if (decoImages.getPicture() != null) {
                    existingDecoImages.setPicture(decoImages.getPicture());
                }
                if (decoImages.getPictureContentType() != null) {
                    existingDecoImages.setPictureContentType(decoImages.getPictureContentType());
                }

                return existingDecoImages;
            })
            .map(decoImagesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, decoImages.getId().toString())
        );
    }

    /**
     * {@code GET  /deco-images} : get all the decoImages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of decoImages in body.
     */
    @GetMapping("/deco-images")
    public List<DecoImages> getAllDecoImages() {
        log.debug("REST request to get all DecoImages");
        return decoImagesRepository.findAll();
    }

    /**
     * {@code GET  /deco-images/:id} : get the "id" decoImages.
     *
     * @param id the id of the decoImages to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the decoImages, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/deco-images/{id}")
    public ResponseEntity<DecoImages> getDecoImages(@PathVariable Long id) {
        log.debug("REST request to get DecoImages : {}", id);
        Optional<DecoImages> decoImages = decoImagesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(decoImages);
    }

    /**
     * {@code DELETE  /deco-images/:id} : delete the "id" decoImages.
     *
     * @param id the id of the decoImages to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/deco-images/{id}")
    public ResponseEntity<Void> deleteDecoImages(@PathVariable Long id) {
        log.debug("REST request to delete DecoImages : {}", id);
        decoImagesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
