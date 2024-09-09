package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.DiscountLink;
import com.mycompany.myapp.repository.DiscountLinkRepository;
import com.mycompany.myapp.service.DiscountLinkService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.DiscountLink}.
 */
@RestController
@RequestMapping("/api/discount-links")
public class DiscountLinkResource {

    private static final Logger LOG = LoggerFactory.getLogger(DiscountLinkResource.class);

    private static final String ENTITY_NAME = "discountLink";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiscountLinkService discountLinkService;

    private final DiscountLinkRepository discountLinkRepository;

    public DiscountLinkResource(DiscountLinkService discountLinkService, DiscountLinkRepository discountLinkRepository) {
        this.discountLinkService = discountLinkService;
        this.discountLinkRepository = discountLinkRepository;
    }

    /**
     * {@code POST  /discount-links} : Create a new discountLink.
     *
     * @param discountLink the discountLink to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new discountLink, or with status {@code 400 (Bad Request)} if the discountLink has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<DiscountLink> createDiscountLink(@RequestBody DiscountLink discountLink) throws URISyntaxException {
        LOG.debug("REST request to save DiscountLink : {}", discountLink);
        if (discountLink.getId() != null) {
            throw new BadRequestAlertException("A new discountLink cannot already have an ID", ENTITY_NAME, "idexists");
        }
        discountLink = discountLinkService.save(discountLink);
        return ResponseEntity.created(new URI("/api/discount-links/" + discountLink.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, discountLink.getId()))
            .body(discountLink);
    }

    /**
     * {@code PUT  /discount-links/:id} : Updates an existing discountLink.
     *
     * @param id the id of the discountLink to save.
     * @param discountLink the discountLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discountLink,
     * or with status {@code 400 (Bad Request)} if the discountLink is not valid,
     * or with status {@code 500 (Internal Server Error)} if the discountLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DiscountLink> updateDiscountLink(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody DiscountLink discountLink
    ) throws URISyntaxException {
        LOG.debug("REST request to update DiscountLink : {}, {}", id, discountLink);
        if (discountLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discountLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discountLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        discountLink = discountLinkService.update(discountLink);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discountLink.getId()))
            .body(discountLink);
    }

    /**
     * {@code PATCH  /discount-links/:id} : Partial updates given fields of an existing discountLink, field will ignore if it is null
     *
     * @param id the id of the discountLink to save.
     * @param discountLink the discountLink to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discountLink,
     * or with status {@code 400 (Bad Request)} if the discountLink is not valid,
     * or with status {@code 404 (Not Found)} if the discountLink is not found,
     * or with status {@code 500 (Internal Server Error)} if the discountLink couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DiscountLink> partialUpdateDiscountLink(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody DiscountLink discountLink
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update DiscountLink partially : {}, {}", id, discountLink);
        if (discountLink.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discountLink.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discountLinkRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DiscountLink> result = discountLinkService.partialUpdate(discountLink);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discountLink.getId())
        );
    }

    /**
     * {@code GET  /discount-links} : get all the discountLinks.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of discountLinks in body.
     */
    @GetMapping("")
    public ResponseEntity<List<DiscountLink>> getAllDiscountLinks(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of DiscountLinks");
        Page<DiscountLink> page = discountLinkService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /discount-links/:id} : get the "id" discountLink.
     *
     * @param id the id of the discountLink to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the discountLink, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DiscountLink> getDiscountLink(@PathVariable("id") String id) {
        LOG.debug("REST request to get DiscountLink : {}", id);
        Optional<DiscountLink> discountLink = discountLinkService.findOne(id);
        return ResponseUtil.wrapOrNotFound(discountLink);
    }

    /**
     * {@code DELETE  /discount-links/:id} : delete the "id" discountLink.
     *
     * @param id the id of the discountLink to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscountLink(@PathVariable("id") String id) {
        LOG.debug("REST request to delete DiscountLink : {}", id);
        discountLinkService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
