package com.jalrakshak.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    // In production, use Redis with TTL for distributed deployments
    // For now, use in-memory ConcurrentHashMap with expiry
    private final ConcurrentHashMap<String, Instant> blacklist = new ConcurrentHashMap<>();

    public void blacklist(String token, Instant expiry) {
        blacklist.put(token, expiry);
    }

    public boolean isBlacklisted(String token) {
        Instant expiry = blacklist.get(token);
        if (expiry == null) {
            return false;
        }
        // Clean up expired entries
        if (expiry.isBefore(Instant.now())) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }

    // Cleanup expired entries periodically (call from a scheduled task in production)
    public void cleanupExpired() {
        Instant now = Instant.now();
        blacklist.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}