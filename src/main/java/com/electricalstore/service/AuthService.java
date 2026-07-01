package com.electricalstore.service;

import com.electricalstore.dto.AuthResponse;
import com.electricalstore.dto.ForgotPasswordRequest;
import com.electricalstore.dto.LoginRequest;
import com.electricalstore.dto.RegisterRequest;
import com.electricalstore.dto.ResetPasswordRequest;
import com.electricalstore.dto.UserProfileResponse;
import com.electricalstore.validation.InputLimits;
import com.electricalstore.validation.InputSanitizer;
import com.electricalstore.entity.User;
import com.electricalstore.entity.UserRole;
import com.electricalstore.repository.UserRepository;
import com.electricalstore.security.JwtService;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final int RESET_PIN_EXPIRY_MINUTES = 15;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = InputSanitizer.email(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = userRepository.save(User.builder()
                .email(email)
                .fullName(InputSanitizer.requiredText(request.fullName(), InputLimits.PERSON_NAME, "Повне ім'я"))
                .passwordHash(passwordEncoder.encode(request.password()))
                .build());

        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = InputSanitizer.email(request.email());
        User user = userRepository
                .findByEmailIgnoreCase(email)
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        return toAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(User user) {
        UserRole role = user.getRole() != null ? user.getRole() : UserRole.USER;
        return new UserProfileResponse(user.getId(), user.getEmail(), user.getFullName(), role.name());
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = InputSanitizer.email(request.email());
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            String pin = String.format("%06d", SECURE_RANDOM.nextInt(900_000) + 100_000);
            user.setResetPin(pin);
            user.setResetPinExpiry(LocalDateTime.now().plusMinutes(RESET_PIN_EXPIRY_MINUTES));
            userRepository.save(user);
            emailService.sendPasswordResetPin(user.getEmail(), user.getFullName(), pin);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = InputSanitizer.email(request.email());
        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Невірний або прострочений код"));

        String pin = request.pin().trim();
        LocalDateTime expiry = user.getResetPinExpiry();

        if (user.getResetPin() == null
                || expiry == null
                || !user.getResetPin().equals(pin)
                || expiry.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Невірний або прострочений код");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setResetPin(null);
        user.setResetPinExpiry(null);
        userRepository.save(user);
    }

    private AuthResponse toAuthResponse(User user) {
        UserRole role = user.getRole() != null ? user.getRole() : UserRole.USER;
        return new AuthResponse(
                jwtService.generateToken(user),
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                role.name());
    }
}
