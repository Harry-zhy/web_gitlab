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
import team.bham.domain.FavouritesList;
import team.bham.repository.FavouritesListRepository;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.FavouritesList}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FavouritesListResource {

    private final Logger log = LoggerFactory.getLogger(FavouritesListResource.class);

    private static final String ENTITY_NAME = "favouritesList";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FavouritesListRepository favouritesListRepository;

    public FavouritesListResource(FavouritesListRepository favouritesListRepository) {
        this.favouritesListRepository = favouritesListRepository;
    }

    /**
     * {@code POST  /favourites-lists} : Create a new favouritesList.
     *
     * @param favouritesList the favouritesList to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new favouritesList, or with status {@code 400 (Bad Request)} if the favouritesList has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/favourites-lists")
    public ResponseEntity<FavouritesList> createFavouritesList(@RequestBody FavouritesList favouritesList) throws URISyntaxException {
        log.debug("REST request to save FavouritesList : {}", favouritesList);
        if (favouritesList.getId() != null) {
            throw new BadRequestAlertException("A new favouritesList cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FavouritesList result = favouritesListRepository.save(favouritesList);
        return ResponseEntity
            .created(new URI("/api/favourites-lists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /favourites-lists/:id} : Updates an existing favouritesList.
     *
     * @param id the id of the favouritesList to save.
     * @param favouritesList the favouritesList to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated favouritesList,
     * or with status {@code 400 (Bad Request)} if the favouritesList is not valid,
     * or with status {@code 500 (Internal Server Error)} if the favouritesList couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/favourites-lists/{id}")
    public ResponseEntity<FavouritesList> updateFavouritesList(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FavouritesList favouritesList
    ) throws URISyntaxException {
        log.debug("REST request to update FavouritesList : {}, {}", id, favouritesList);
        if (favouritesList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, favouritesList.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!favouritesListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        FavouritesList result = favouritesList;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, favouritesList.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /favourites-lists/:id} : Partial updates given fields of an existing favouritesList, field will ignore if it is null
     *
     * @param id the id of the favouritesList to save.
     * @param favouritesList the favouritesList to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated favouritesList,
     * or with status {@code 400 (Bad Request)} if the favouritesList is not valid,
     * or with status {@code 404 (Not Found)} if the favouritesList is not found,
     * or with status {@code 500 (Internal Server Error)} if the favouritesList couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/favourites-lists/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FavouritesList> partialUpdateFavouritesList(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FavouritesList favouritesList
    ) throws URISyntaxException {
        log.debug("REST request to partial update FavouritesList partially : {}, {}", id, favouritesList);
        if (favouritesList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, favouritesList.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!favouritesListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FavouritesList> result = favouritesListRepository
            .findById(favouritesList.getId())
            .map(existingFavouritesList -> {
                return existingFavouritesList;
            }); // .map(favouritesListRepository::save)

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, favouritesList.getId().toString())
        );
    }

    /**
     * {@code GET  /favourites-lists} : get all the favouritesLists.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of favouritesLists in body.
     */
    @GetMapping("/favourites-lists")
    public List<FavouritesList> getAllFavouritesLists() {
        log.debug("REST request to get all FavouritesLists");
        return favouritesListRepository.findAll();
    }

    /**
     * {@code GET  /favourites-lists/:id} : get the "id" favouritesList.
     *
     * @param id the id of the favouritesList to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the favouritesList, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/favourites-lists/{id}")
    public ResponseEntity<FavouritesList> getFavouritesList(@PathVariable Long id) {
        log.debug("REST request to get FavouritesList : {}", id);
        Optional<FavouritesList> favouritesList = favouritesListRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(favouritesList);
    }

    /**
     * {@code DELETE  /favourites-lists/:id} : delete the "id" favouritesList.
     *
     * @param id the id of the favouritesList to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/favourites-lists/{id}")
    public ResponseEntity<Void> deleteFavouritesList(@PathVariable Long id) {
        log.debug("REST request to delete FavouritesList : {}", id);
        favouritesListRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
