package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.DiscountUsage;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.DiscountUsage}.
 */
public interface DiscountUsageService {
    /**
     * Save a discountUsage.
     *
     * @param discountUsage the entity to save.
     * @return the persisted entity.
     */
    DiscountUsage save(DiscountUsage discountUsage);

    /**
     * Updates a discountUsage.
     *
     * @param discountUsage the entity to update.
     * @return the persisted entity.
     */
    DiscountUsage update(DiscountUsage discountUsage);

    /**
     * Partially updates a discountUsage.
     *
     * @param discountUsage the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DiscountUsage> partialUpdate(DiscountUsage discountUsage);

    /**
     * Get all the discountUsages.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DiscountUsage> findAll(Pageable pageable);

    /**
     * Get the "id" discountUsage.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DiscountUsage> findOne(String id);

    /**
     * Delete the "id" discountUsage.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
