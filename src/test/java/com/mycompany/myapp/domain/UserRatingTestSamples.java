package com.mycompany.myapp.domain;

import java.util.UUID;

public class UserRatingTestSamples {

    public static UserRating getUserRatingSample1() {
        return new UserRating().id("id1");
    }

    public static UserRating getUserRatingSample2() {
        return new UserRating().id("id2");
    }

    public static UserRating getUserRatingRandomSampleGenerator() {
        return new UserRating().id(UUID.randomUUID().toString());
    }
}
