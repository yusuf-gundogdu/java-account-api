package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.DiscountUsageTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DiscountUsageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DiscountUsage.class);
        DiscountUsage discountUsage1 = getDiscountUsageSample1();
        DiscountUsage discountUsage2 = new DiscountUsage();
        assertThat(discountUsage1).isNotEqualTo(discountUsage2);

        discountUsage2.setId(discountUsage1.getId());
        assertThat(discountUsage1).isEqualTo(discountUsage2);

        discountUsage2 = getDiscountUsageSample2();
        assertThat(discountUsage1).isNotEqualTo(discountUsage2);
    }
}
