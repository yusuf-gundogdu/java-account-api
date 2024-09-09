package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.UserRating;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserRating entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserRatingRepository extends JpaRepository<UserRating, String> {
    @Query("select userRating from UserRating userRating where userRating.user.login = ?#{authentication.name}")
    List<UserRating> findByUserIsCurrentUser();
}
