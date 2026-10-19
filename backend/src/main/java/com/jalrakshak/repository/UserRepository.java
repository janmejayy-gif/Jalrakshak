package com.jalrakshak.repository;

import com.jalrakshak.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = :isActive")
    java.util.List<User> findByRoleAndIsActive(@Param("role") User.Role role, @Param("isActive") boolean isActive);
    
    Optional<User> findByVerificationToken(String verificationToken);
    
    Optional<User> findByResetTokenHash(String resetTokenHash);
}