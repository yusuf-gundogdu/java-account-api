package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DiscountUsage;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DiscountUsage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DiscountUsageRepository extends JpaRepository<DiscountUsage, String> {
    @Query("select discountUsage from DiscountUsage discountUsage where discountUsage.user.login = ?#{authentication.name}")
    List<DiscountUsage> findByUserIsCurrentUser();
}
