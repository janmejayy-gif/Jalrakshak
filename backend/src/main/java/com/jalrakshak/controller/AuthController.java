package com.jalrakshak.controller;

import com.jalrakshak.dto.AuthResponse;
import com.jalrakshak.dto.ForgotPasswordRequest;
import com.jalrakshak.dto.LoginRequest;
import com.jalrakshak.dto.RegisterRequest;
import com.jalrakshak.dto.ResendVerificationRequest;
import com.jalrakshak.dto.ResetPasswordRequest;
import com.jalrakshak.dto.UserDto;
import com.jalrakshak.dto.VerifyEmailRequest;
import com.jalrakshak.security.JwtService;
import com.jalrakshak.security.TokenBlacklistService;
import com.jalrakshak.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserDto user = userService.register(request.getEmail(), request.getPassword(), request.getFullName(), request.getPhone());
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return ResponseEntity.ok(AuthResponse.of(token, 86400000, user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        UserDto user = userService.getByEmailWithPassword(request.getEmail());
        if (!userService.verifyPassword(request.getPassword(), user.getPasswordHash())) {
            throw new com.jalrakshak.exception.ForbiddenException("Invalid credentials");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        userService.updateLastLogin(user.getId());
        // Return user without password hash
        UserDto safeUser = userService.getById(user.getId());
        return ResponseEntity.ok(AuthResponse.of(token, 86400000, safeUser));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(@RequestAttribute("userId") UUID userId,
                                                @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        // Blacklist the token with its expiry
        Instant expiry = jwtService.parseToken(token).getExpiration().toInstant();
        tokenBlacklistService.blacklist(token, expiry);
        return ResponseEntity.ok(AuthResponse.message("Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestAttribute("userId") UUID userId) {
        UserDto user = userService.getById(userId);
        return ResponseEntity.ok(user);
    }

    // Password Reset Flow
    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request.getEmail());
        // Always return success to prevent email enumeration
        return ResponseEntity.ok(AuthResponse.message("If the email exists, a password reset link has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(AuthResponse.message("Password has been reset successfully"));
    }

    // Email Verification Flow
    @PostMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        userService.verifyEmail(request.getToken());
        return ResponseEntity.ok(AuthResponse.message("Email verified successfully"));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<AuthResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        userService.resendVerificationEmail(request.getEmail());
        // Always return success to prevent email enumeration
        return ResponseEntity.ok(AuthResponse.message("If the email exists and is not verified, a verification link has been sent"));
    }
}