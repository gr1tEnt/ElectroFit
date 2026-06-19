package com.electricalstore.controller;

import com.electricalstore.dto.AuthResponse;
import com.electricalstore.dto.ForgotPasswordRequest;
import com.electricalstore.dto.LoginRequest;
import com.electricalstore.dto.MessageResponse;
import com.electricalstore.dto.RegisterRequest;
import com.electricalstore.dto.ResetPasswordRequest;
import com.electricalstore.dto.UserProfileResponse;
import com.electricalstore.entity.User;
import com.electricalstore.security.UserPrincipal;
import com.electricalstore.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration and JWT login")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(
            path = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new user")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping(
            path = "/login",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Login and receive JWT")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping(
            path = "/forgot-password",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Request password reset PIN by email")
    public MessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return new MessageResponse(
                "Якщо обліковий запис існує, код надіслано на вашу електронну пошту.");
    }

    @PostMapping(
            path = "/reset-password",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Reset password using email PIN")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return new MessageResponse("Пароль успішно змінено. Тепер ви можете увійти.");
    }

    @GetMapping(path = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Current authenticated user profile")
    public UserProfileResponse me(@AuthenticationPrincipal UserPrincipal principal) {
        User user = principal.getUser();
        return authService.getProfile(user);
    }
}
