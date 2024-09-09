package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DiscountLink;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DiscountLink entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DiscountLinkRepository extends JpaRepository<DiscountLink, String> {}
