package com.electricalstore.validation;

public final class InputLimits {

    public static final int EMAIL = 254;
    public static final int PASSWORD = 72;
    public static final int PERSON_NAME = 120;
    public static final int SKU = 64;
    public static final int PRODUCT_NAME = 200;
    public static final int DESCRIPTION = 10_000;
    public static final int BRAND_OR_CATEGORY = 100;
    public static final int CATALOG_FILTER = 100;
    public static final int CATALOG_SEARCH = 200;
    public static final int SERIES_NAME = 120;
    public static final int REVIEW_COMMENT = 2_000;
    public static final int SUPPORT_MESSAGE = 5_000;
    public static final int SUPPORT_REPLY = 5_000;
    public static final int ORDER_LINE_NAME = 200;
    public static final int INQUIRY_TYPE = 80;

    private InputLimits() {}
}
