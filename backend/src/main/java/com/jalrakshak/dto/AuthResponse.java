package com.jalrakshak.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private UserDto user;
    private String message;

    public static AuthResponse of(String accessToken, long expiresIn, UserDto user) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .expiresIn(expiresIn)
                .user(user)
                .build();
    }

    public static AuthResponse message(String message) {
        return AuthResponse.builder()
                .message(message)
                .build();
    }
}