package com.mycompany.myapp.domain;

import java.util.UUID;

public class DiscountLinkTestSamples {

    public static DiscountLink getDiscountLinkSample1() {
        return new DiscountLink().id("id1");
    }

    public static DiscountLink getDiscountLinkSample2() {
        return new DiscountLink().id("id2");
    }

    public static DiscountLink getDiscountLinkRandomSampleGenerator() {
        return new DiscountLink().id(UUID.randomUUID().toString());
    }
}
