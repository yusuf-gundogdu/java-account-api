package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.UserRating;
import com.mycompany.myapp.repository.UserRatingRepository;
import com.mycompany.myapp.service.UserRatingService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.UserRating}.
 */
@RestController
@RequestMapping("/api/user-ratings")
public class UserRatingResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserRatingResource.class);

    private static final String ENTITY_NAME = "userRating";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserRatingService userRatingService;

    private final UserRatingRepository userRatingRepository;

    public UserRatingResource(UserRatingService userRatingService, UserRatingRepository userRatingRepository) {
        this.userRatingService = userRatingService;
        this.userRatingRepository = userRatingRepository;
    }

    /**
     * {@code POST  /user-ratings} : Create a new userRating.
     *
     * @param userRating the userRating to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userRating, or with status {@code 400 (Bad Request)} if the userRating has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<UserRating> createUserRating(@RequestBody UserRating userRating) throws URISyntaxException {
        LOG.debug("REST request to save UserRating : {}", userRating);
        if (userRating.getId() != null) {
            throw new BadRequestAlertException("A new userRating cannot already have an ID", ENTITY_NAME, "idexists");
        }
        userRating = userRatingService.save(userRating);
        return ResponseEntity.created(new URI("/api/user-ratings/" + userRating.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, userRating.getId()))
            .body(userRating);
    }

    /**
     * {@code PUT  /user-ratings/:id} : Updates an existing userRating.
     *
     * @param id the id of the userRating to save.
     * @param userRating the userRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userRating,
     * or with status {@code 400 (Bad Request)} if the userRating is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserRating> updateUserRating(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody UserRating userRating
    ) throws URISyntaxException {
        LOG.debug("REST request to update UserRating : {}, {}", id, userRating);
        if (userRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        userRating = userRatingService.update(userRating);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userRating.getId()))
            .body(userRating);
    }

    /**
     * {@code PATCH  /user-ratings/:id} : Partial updates given fields of an existing userRating, field will ignore if it is null
     *
     * @param id the id of the userRating to save.
     * @param userRating the userRating to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userRating,
     * or with status {@code 400 (Bad Request)} if the userRating is not valid,
     * or with status {@code 404 (Not Found)} if the userRating is not found,
     * or with status {@code 500 (Internal Server Error)} if the userRating couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserRating> partialUpdateUserRating(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody UserRating userRating
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update UserRating partially : {}, {}", id, userRating);
        if (userRating.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userRating.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userRatingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserRating> result = userRatingService.partialUpdate(userRating);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userRating.getId())
        );
    }

    /**
     * {@code GET  /user-ratings} : get all the userRatings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userRatings in body.
     */
    @GetMapping("")
    public ResponseEntity<List<UserRating>> getAllUserRatings(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of UserRatings");
        Page<UserRating> page = userRatingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-ratings/:id} : get the "id" userRating.
     *
     * @param id the id of the userRating to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userRating, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserRating> getUserRating(@PathVariable("id") String id) {
        LOG.debug("REST request to get UserRating : {}", id);
        Optional<UserRating> userRating = userRatingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userRating);
    }

    /**
     * {@code DELETE  /user-ratings/:id} : delete the "id" userRating.
     *
     * @param id the id of the userRating to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserRating(@PathVariable("id") String id) {
        LOG.debug("REST request to delete UserRating : {}", id);
        userRatingService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
