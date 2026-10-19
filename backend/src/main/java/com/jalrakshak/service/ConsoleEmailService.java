package com.jalrakshak.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ConsoleEmailService implements EmailService {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void sendVerificationEmail(String email, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        System.out.println("==========================================");
        System.out.println("[DEV EMAIL] Verification Email");
        System.out.println("To: " + email);
        System.out.println("Subject: Verify your JALRAKSHAK account");
        System.out.println("Body: Please verify your email by clicking: " + verificationUrl);
        System.out.println("Token (for testing): " + token);
        System.out.println("==========================================");
    }

    @Override
    public void sendPasswordResetEmail(String email, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        System.out.println("==========================================");
        System.out.println("[DEV EMAIL] Password Reset Email");
        System.out.println("To: " + email);
        System.out.println("Subject: Reset your JALRAKSHAK password");
        System.out.println("Body: Reset your password by clicking: " + resetUrl);
        System.out.println("Token (for testing): " + token);
        System.out.println("==========================================");
    }

    @Override
    public void sendWelcomeEmail(String email, String fullName) {
        System.out.println("==========================================");
        System.out.println("[DEV EMAIL] Welcome Email");
        System.out.println("To: " + email);
        System.out.println("Subject: Welcome to JALRAKSHAK");
        System.out.println("Body: Welcome " + fullName + "! Your account has been created.");
        System.out.println("==========================================");
    }
}