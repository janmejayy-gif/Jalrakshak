package com.jalrakshak.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("prod")
public class ProductionEmailService implements EmailService {

    @Value("${email.provider.api-key:}")
    private String apiKey;

    @Value("${email.provider.from:}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void sendVerificationEmail(String email, String token) {
        // TODO: Implement with your email provider (SendGrid, AWS SES, Mailgun, etc.)
        // Example with SendGrid:
        // SendGrid sg = new SendGrid(apiKey);
        // Email from = new Email(fromEmail);
        // Email to = new Email(email);
        // Content content = new Content("text/html", buildVerificationHtml(token));
        // Mail mail = new Mail(from, "Verify your JALRAKSHAK account", to, content);
        // Request request = new Request();
        // request.setMethod(Method.POST);
        // request.setEndpoint("mail/send");
        // request.setBody(mail.build());
        // sg.api(request);
        throw new UnsupportedOperationException("Production email service not configured. Set email.provider.api-key and implement provider integration.");
    }

    @Override
    public void sendPasswordResetEmail(String email, String token) {
        // TODO: Implement with your email provider
        throw new UnsupportedOperationException("Production email service not configured. Set email.provider.api-key and implement provider integration.");
    }

    @Override
    public void sendWelcomeEmail(String email, String fullName) {
        // TODO: Implement with your email provider
        throw new UnsupportedOperationException("Production email service not configured. Set email.provider.api-key and implement provider integration.");
    }

    private String buildVerificationHtml(String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        return "<html><body>" +
                "<h2>Verify your JALRAKSHAK account</h2>" +
                "<p>Please click the link below to verify your email:</p>" +
                "<p><a href=\"" + verificationUrl + "\">Verify Email</a></p>" +
                "<p>Or copy this link: " + verificationUrl + "</p>" +
                "</body></html>";
    }
}