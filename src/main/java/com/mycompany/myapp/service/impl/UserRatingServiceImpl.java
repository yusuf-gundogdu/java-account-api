package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.UserRating;
import com.mycompany.myapp.repository.UserRatingRepository;
import com.mycompany.myapp.service.UserRatingService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.UserRating}.
 */
@Service
@Transactional
public class UserRatingServiceImpl implements UserRatingService {

    private static final Logger LOG = LoggerFactory.getLogger(UserRatingServiceImpl.class);

    private final UserRatingRepository userRatingRepository;

    public UserRatingServiceImpl(UserRatingRepository userRatingRepository) {
        this.userRatingRepository = userRatingRepository;
    }

    @Override
    public UserRating save(UserRating userRating) {
        LOG.debug("Request to save UserRating : {}", userRating);
        return userRatingRepository.save(userRating);
    }

    @Override
    public UserRating update(UserRating userRating) {
        LOG.debug("Request to update UserRating : {}", userRating);
        return userRatingRepository.save(userRating);
    }

    @Override
    public Optional<UserRating> partialUpdate(UserRating userRating) {
        LOG.debug("Request to partially update UserRating : {}", userRating);

        return userRatingRepository
            .findById(userRating.getId())
            .map(existingUserRating -> {
                if (userRating.getRating() != null) {
                    existingUserRating.setRating(userRating.getRating());
                }
                if (userRating.getReviewDate() != null) {
                    existingUserRating.setReviewDate(userRating.getReviewDate());
                }

                return existingUserRating;
            })
            .map(userRatingRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserRating> findAll(Pageable pageable) {
        LOG.debug("Request to get all UserRatings");
        return userRatingRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserRating> findOne(String id) {
        LOG.debug("Request to get UserRating : {}", id);
        return userRatingRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        LOG.debug("Request to delete UserRating : {}", id);
        userRatingRepository.deleteById(id);
    }
}
