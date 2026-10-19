package com.jalrakshak.exception;

public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }

    public static ForbiddenException farmAccessDenied() {
        return new ForbiddenException("Access denied: You do not own this farm");
    }
    
    public static ForbiddenException resourceAccessDenied(String resource) {
        return new ForbiddenException("Access denied: You do not have permission to access this " + resource);
    }
}