package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.DiscountLink;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.DiscountLink}.
 */
public interface DiscountLinkService {
    /**
     * Save a discountLink.
     *
     * @param discountLink the entity to save.
     * @return the persisted entity.
     */
    DiscountLink save(DiscountLink discountLink);

    /**
     * Updates a discountLink.
     *
     * @param discountLink the entity to update.
     * @return the persisted entity.
     */
    DiscountLink update(DiscountLink discountLink);

    /**
     * Partially updates a discountLink.
     *
     * @param discountLink the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DiscountLink> partialUpdate(DiscountLink discountLink);

    /**
     * Get all the discountLinks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DiscountLink> findAll(Pageable pageable);

    /**
     * Get the "id" discountLink.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DiscountLink> findOne(String id);

    /**
     * Delete the "id" discountLink.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
