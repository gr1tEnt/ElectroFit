package com.electricalstore.validation.validator;

import com.electricalstore.validation.RoomTypes;
import com.electricalstore.validation.annotation.AllowedRoomType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AllowedRoomTypeValidator implements ConstraintValidator<AllowedRoomType, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return false;
        }
        try {
            RoomTypes.requireAllowed(value);
            return true;
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
