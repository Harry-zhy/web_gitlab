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
import team.bham.domain.FavouritesListItem;
import team.bham.repository.FavouritesListItemRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.FavouritesListItem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FavouritesListItemResource {

    private final Logger log = LoggerFactory.getLogger(FavouritesListItemResource.class);

    private static final String ENTITY_NAME = "favouritesListItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FavouritesListItemRepository favouritesListItemRepository;

    public FavouritesListItemResource(FavouritesListItemRepository favouritesListItemRepository) {
        this.favouritesListItemRepository = favouritesListItemRepository;
    }

    /**
     * {@code POST  /favourites-list-items} : Create a new favouritesListItem.
     *
     * @param favouritesListItem the favouritesListItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new favouritesListItem, or with status {@code 400 (Bad Request)} if the favouritesListItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/favourites-list-items")
    public ResponseEntity<FavouritesListItem> createFavouritesListItem(@RequestBody FavouritesListItem favouritesListItem)
        throws URISyntaxException {
        log.debug("REST request to save FavouritesListItem : {}", favouritesListItem);
        if (favouritesListItem.getId() != null) {
            throw new BadRequestAlertException("A new favouritesListItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FavouritesListItem result = favouritesListItemRepository.save(favouritesListItem);
        return ResponseEntity
            .created(new URI("/api/favourites-list-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /favourites-list-items/:id} : Updates an existing favouritesListItem.
     *
     * @param id the id of the favouritesListItem to save.
     * @param favouritesListItem the favouritesListItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated favouritesListItem,
     * or with status {@code 400 (Bad Request)} if the favouritesListItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the favouritesListItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/favourites-list-items/{id}")
    public ResponseEntity<FavouritesListItem> updateFavouritesListItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FavouritesListItem favouritesListItem
    ) throws URISyntaxException {
        log.debug("REST request to update FavouritesListItem : {}, {}", id, favouritesListItem);
        if (favouritesListItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, favouritesListItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!favouritesListItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FavouritesListItem result = favouritesListItemRepository.save(favouritesListItem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, favouritesListItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /favourites-list-items/:id} : Partial updates given fields of an existing favouritesListItem, field will ignore if it is null
     *
     * @param id the id of the favouritesListItem to save.
     * @param favouritesListItem the favouritesListItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated favouritesListItem,
     * or with status {@code 400 (Bad Request)} if the favouritesListItem is not valid,
     * or with status {@code 404 (Not Found)} if the favouritesListItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the favouritesListItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/favourites-list-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FavouritesListItem> partialUpdateFavouritesListItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FavouritesListItem favouritesListItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update FavouritesListItem partially : {}, {}", id, favouritesListItem);
        if (favouritesListItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, favouritesListItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!favouritesListItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FavouritesListItem> result = favouritesListItemRepository
            .findById(favouritesListItem.getId())
            .map(existingFavouritesListItem -> {
                if (favouritesListItem.getName() != null) {
                    existingFavouritesListItem.setName(favouritesListItem.getName());
                }
                if (favouritesListItem.getCategory() != null) {
                    existingFavouritesListItem.setCategory(favouritesListItem.getCategory());
                }
                if (favouritesListItem.getDescription() != null) {
                    existingFavouritesListItem.setDescription(favouritesListItem.getDescription());
                }

                return existingFavouritesListItem;
            })
            .map(favouritesListItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, favouritesListItem.getId().toString())
        );
    }

    /**
     * {@code GET  /favourites-list-items} : get all the favouritesListItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of favouritesListItems in body.
     */
    @GetMapping("/favourites-list-items")
    public List<FavouritesListItem> getAllFavouritesListItems() {
        log.debug("REST request to get all FavouritesListItems");
        return favouritesListItemRepository.findAll();
    }

    /**
     * {@code GET  /favourites-list-items/:id} : get the "id" favouritesListItem.
     *
     * @param id the id of the favouritesListItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the favouritesListItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/favourites-list-items/{id}")
    public ResponseEntity<FavouritesListItem> getFavouritesListItem(@PathVariable Long id) {
        log.debug("REST request to get FavouritesListItem : {}", id);
        Optional<FavouritesListItem> favouritesListItem = favouritesListItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(favouritesListItem);
    }

    /**
     * {@code DELETE  /favourites-list-items/:id} : delete the "id" favouritesListItem.
     *
     * @param id the id of the favouritesListItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/favourites-list-items/{id}")
    public ResponseEntity<Void> deleteFavouritesListItem(@PathVariable Long id) {
        log.debug("REST request to delete FavouritesListItem : {}", id);
        favouritesListItemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
