package com.mycompany.myapp.domain;

import java.util.UUID;

public class DiscountUsageTestSamples {

    public static DiscountUsage getDiscountUsageSample1() {
        return new DiscountUsage().id("id1");
    }

    public static DiscountUsage getDiscountUsageSample2() {
        return new DiscountUsage().id("id2");
    }

    public static DiscountUsage getDiscountUsageRandomSampleGenerator() {
        return new DiscountUsage().id(UUID.randomUUID().toString());
    }
}
