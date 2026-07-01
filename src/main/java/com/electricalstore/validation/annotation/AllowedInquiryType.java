package com.electricalstore.validation.annotation;

import com.electricalstore.validation.validator.AllowedInquiryTypeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = AllowedInquiryTypeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface AllowedInquiryType {

    String message() default "Недопустимий тип звернення";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
