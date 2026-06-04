package com.electricalstore.entity;

import java.util.Arrays;
import java.util.List;

public enum IpRating {
    IP20(20),
    IP44(44),
    IP54(54),
    IP55(55),
    IP65(65);

    private final int value;

    IpRating(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static List<IpRating> withMinimumRating(int minimum) {
        return Arrays.stream(values())
                .filter(rating -> rating.value >= minimum)
                .toList();
    }
}
