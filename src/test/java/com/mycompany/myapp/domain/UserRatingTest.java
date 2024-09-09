package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CompanyTestSamples.*;
import static com.mycompany.myapp.domain.UserRatingTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserRatingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserRating.class);
        UserRating userRating1 = getUserRatingSample1();
        UserRating userRating2 = new UserRating();
        assertThat(userRating1).isNotEqualTo(userRating2);

        userRating2.setId(userRating1.getId());
        assertThat(userRating1).isEqualTo(userRating2);

        userRating2 = getUserRatingSample2();
        assertThat(userRating1).isNotEqualTo(userRating2);
    }

    @Test
    void companyTest() {
        UserRating userRating = getUserRatingRandomSampleGenerator();
        Company companyBack = getCompanyRandomSampleGenerator();

        userRating.setCompany(companyBack);
        assertThat(userRating.getCompany()).isEqualTo(companyBack);

        userRating.company(null);
        assertThat(userRating.getCompany()).isNull();
    }
}
