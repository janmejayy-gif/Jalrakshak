package com.jalrakshak.service;

import com.jalrakshak.dto.UserDto;
import com.jalrakshak.entity.User;
import com.jalrakshak.exception.ResourceNotFoundException;
import com.jalrakshak.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public UserDto register(String email, String password, String fullName, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .fullName(fullName)
                .phone(phone)
                .role(User.Role.FARMER)
                .isActive(true)
                .emailVerified(false)
                .build();
        User savedUser = userRepository.save(user);
        
        // Generate verification token
        String verificationToken = generateSecureToken();
        savedUser.setVerificationToken(verificationToken);
        savedUser.setVerificationTokenExpiry(Instant.now().plus(Duration.ofHours(24)));
        userRepository.save(savedUser);
        
        // Send verification email (async in production)
        emailService.sendVerificationEmail(email, verificationToken);
        emailService.sendWelcomeEmail(email, fullName);
        
        return UserDto.fromEntity(savedUser);
    }

    public UserDto getById(UUID id) {
        return userRepository.findById(id)
                .map(UserDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public UserDto getByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public UserDto getByEmailWithPassword(String email) {
        return userRepository.findByEmail(email)
                .map(UserDto::fromEntityWithPassword)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public List<UserDto> getAllFarmers() {
        return userRepository.findByRoleAndIsActive(User.Role.FARMER, true)
                .stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    @Transactional
    public UserDto updateLastLogin(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setLastLoginAt(Instant.now());
        return UserDto.fromEntity(userRepository.save(user));
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // Password Reset Flow
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElse(null); // Don't reveal if email exists
        
        if (user != null && user.getIsActive()) {
            String resetToken = generateSecureToken();
            String resetTokenHash = passwordEncoder.encode(resetToken);
            
            user.setResetTokenHash(resetTokenHash);
            user.setResetTokenExpiry(Instant.now().plus(Duration.ofHours(1)));
            userRepository.save(user);
            
            // Send reset email with raw token (only time raw token is exposed)
            emailService.sendPasswordResetEmail(email, resetToken);
        }
        // Always return success to prevent email enumeration
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Find user by comparing token hash
        // Since we can't query by hash directly, we need to check all users with non-expired reset tokens
        // For efficiency, we'll iterate (acceptable for password reset which is rare)
        List<User> candidates = userRepository.findAll().stream()
                .filter(u -> u.getResetTokenHash() != null 
                        && u.getResetTokenExpiry() != null 
                        && u.getResetTokenExpiry().isAfter(Instant.now()))
                .toList();
        
        User user = candidates.stream()
                .filter(u -> passwordEncoder.matches(token, u.getResetTokenHash()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));
        
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetTokenHash(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    // Email Verification Flow
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));
        
        if (user.getVerificationTokenExpiry() == null || user.getVerificationTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Verification token has expired");
        }
        
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElse(null); // Don't reveal if email exists
        
        if (user != null && !user.getEmailVerified() && user.getIsActive()) {
            String verificationToken = generateSecureToken();
            user.setVerificationToken(verificationToken);
            user.setVerificationTokenExpiry(Instant.now().plus(Duration.ofHours(24)));
            userRepository.save(user);
            
            emailService.sendVerificationEmail(email, verificationToken);
        }
        // Always return success to prevent email enumeration
    }

    private String generateSecureToken() {
        return UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
    }
}