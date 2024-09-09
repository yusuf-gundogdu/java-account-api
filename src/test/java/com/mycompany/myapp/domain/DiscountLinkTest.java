package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CompanyTestSamples.*;
import static com.mycompany.myapp.domain.DiscountLinkTestSamples.*;
import static com.mycompany.myapp.domain.DiscountUsageTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DiscountLinkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DiscountLink.class);
        DiscountLink discountLink1 = getDiscountLinkSample1();
        DiscountLink discountLink2 = new DiscountLink();
        assertThat(discountLink1).isNotEqualTo(discountLink2);

        discountLink2.setId(discountLink1.getId());
        assertThat(discountLink1).isEqualTo(discountLink2);

        discountLink2 = getDiscountLinkSample2();
        assertThat(discountLink1).isNotEqualTo(discountLink2);
    }

    @Test
    void discountUsageTest() {
        DiscountLink discountLink = getDiscountLinkRandomSampleGenerator();
        DiscountUsage discountUsageBack = getDiscountUsageRandomSampleGenerator();

        discountLink.setDiscountUsage(discountUsageBack);
        assertThat(discountLink.getDiscountUsage()).isEqualTo(discountUsageBack);

        discountLink.discountUsage(null);
        assertThat(discountLink.getDiscountUsage()).isNull();
    }

    @Test
    void companyTest() {
        DiscountLink discountLink = getDiscountLinkRandomSampleGenerator();
        Company companyBack = getCompanyRandomSampleGenerator();

        discountLink.setCompany(companyBack);
        assertThat(discountLink.getCompany()).isEqualTo(companyBack);

        discountLink.company(null);
        assertThat(discountLink.getCompany()).isNull();
    }
}
