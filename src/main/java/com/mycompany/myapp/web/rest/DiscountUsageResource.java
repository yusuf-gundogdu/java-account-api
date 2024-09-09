package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.DiscountUsage;
import com.mycompany.myapp.repository.DiscountUsageRepository;
import com.mycompany.myapp.service.DiscountUsageService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.DiscountUsage}.
 */
@RestController
@RequestMapping("/api/discount-usages")
public class DiscountUsageResource {

    private static final Logger LOG = LoggerFactory.getLogger(DiscountUsageResource.class);

    private static final String ENTITY_NAME = "discountUsage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiscountUsageService discountUsageService;

    private final DiscountUsageRepository discountUsageRepository;

    public DiscountUsageResource(DiscountUsageService discountUsageService, DiscountUsageRepository discountUsageRepository) {
        this.discountUsageService = discountUsageService;
        this.discountUsageRepository = discountUsageRepository;
    }

    /**
     * {@code POST  /discount-usages} : Create a new discountUsage.
     *
     * @param discountUsage the discountUsage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new discountUsage, or with status {@code 400 (Bad Request)} if the discountUsage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<DiscountUsage> createDiscountUsage(@RequestBody DiscountUsage discountUsage) throws URISyntaxException {
        LOG.debug("REST request to save DiscountUsage : {}", discountUsage);
        if (discountUsage.getId() != null) {
            throw new BadRequestAlertException("A new discountUsage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        discountUsage = discountUsageService.save(discountUsage);
        return ResponseEntity.created(new URI("/api/discount-usages/" + discountUsage.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, discountUsage.getId()))
            .body(discountUsage);
    }

    /**
     * {@code PUT  /discount-usages/:id} : Updates an existing discountUsage.
     *
     * @param id the id of the discountUsage to save.
     * @param discountUsage the discountUsage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discountUsage,
     * or with status {@code 400 (Bad Request)} if the discountUsage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the discountUsage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DiscountUsage> updateDiscountUsage(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody DiscountUsage discountUsage
    ) throws URISyntaxException {
        LOG.debug("REST request to update DiscountUsage : {}, {}", id, discountUsage);
        if (discountUsage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discountUsage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discountUsageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        discountUsage = discountUsageService.update(discountUsage);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discountUsage.getId()))
            .body(discountUsage);
    }

    /**
     * {@code PATCH  /discount-usages/:id} : Partial updates given fields of an existing discountUsage, field will ignore if it is null
     *
     * @param id the id of the discountUsage to save.
     * @param discountUsage the discountUsage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discountUsage,
     * or with status {@code 400 (Bad Request)} if the discountUsage is not valid,
     * or with status {@code 404 (Not Found)} if the discountUsage is not found,
     * or with status {@code 500 (Internal Server Error)} if the discountUsage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DiscountUsage> partialUpdateDiscountUsage(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody DiscountUsage discountUsage
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update DiscountUsage partially : {}, {}", id, discountUsage);
        if (discountUsage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discountUsage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discountUsageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DiscountUsage> result = discountUsageService.partialUpdate(discountUsage);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discountUsage.getId())
        );
    }

    /**
     * {@code GET  /discount-usages} : get all the discountUsages.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of discountUsages in body.
     */
    @GetMapping("")
    public ResponseEntity<List<DiscountUsage>> getAllDiscountUsages(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of DiscountUsages");
        Page<DiscountUsage> page = discountUsageService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /discount-usages/:id} : get the "id" discountUsage.
     *
     * @param id the id of the discountUsage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the discountUsage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DiscountUsage> getDiscountUsage(@PathVariable("id") String id) {
        LOG.debug("REST request to get DiscountUsage : {}", id);
        Optional<DiscountUsage> discountUsage = discountUsageService.findOne(id);
        return ResponseUtil.wrapOrNotFound(discountUsage);
    }

    /**
     * {@code DELETE  /discount-usages/:id} : delete the "id" discountUsage.
     *
     * @param id the id of the discountUsage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscountUsage(@PathVariable("id") String id) {
        LOG.debug("REST request to delete DiscountUsage : {}", id);
        discountUsageService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
