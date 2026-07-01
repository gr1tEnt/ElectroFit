package com.electricalstore.validation.validator;

import com.electricalstore.validation.SupportInquiryTypes;
import com.electricalstore.validation.annotation.AllowedInquiryType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AllowedInquiryTypeValidator implements ConstraintValidator<AllowedInquiryType, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return false;
        }
        try {
            SupportInquiryTypes.requireAllowed(value);
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
