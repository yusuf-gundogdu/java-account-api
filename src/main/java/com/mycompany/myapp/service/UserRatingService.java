package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.UserRating;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.UserRating}.
 */
public interface UserRatingService {
    /**
     * Save a userRating.
     *
     * @param userRating the entity to save.
     * @return the persisted entity.
     */
    UserRating save(UserRating userRating);

    /**
     * Updates a userRating.
     *
     * @param userRating the entity to update.
     * @return the persisted entity.
     */
    UserRating update(UserRating userRating);

    /**
     * Partially updates a userRating.
     *
     * @param userRating the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UserRating> partialUpdate(UserRating userRating);

    /**
     * Get all the userRatings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserRating> findAll(Pageable pageable);

    /**
     * Get the "id" userRating.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserRating> findOne(String id);

    /**
     * Delete the "id" userRating.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
