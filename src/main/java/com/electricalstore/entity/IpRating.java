package com.electricalstore.entity;

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
}
