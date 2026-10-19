package com.jalrakshak.health;

import com.jalrakshak.ml.MlServiceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;
    private final MlServiceClient mlServiceClient;

    public HealthController(DataSource dataSource, MlServiceClient mlServiceClient) {
        this.dataSource = dataSource;
        this.mlServiceClient = mlServiceClient;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        boolean dbHealthy = checkDatabase();
        boolean mlHealthy = mlServiceClient.healthCheck();

        String status = dbHealthy && mlHealthy ? "UP" : "DEGRADED";
        
        return ResponseEntity.ok(Map.of(
                "status", status,
                "service", "jalrakshak-backend",
                "timestamp", Instant.now().toString(),
                "checks", Map.of(
                        "database", dbHealthy ? "UP" : "DOWN",
                        "ml-service", mlHealthy ? "UP" : "DOWN"
                )
        ));
    }

    @GetMapping("/health/live")
    public ResponseEntity<Map<String, Object>> liveness() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "jalrakshak-backend",
                "timestamp", Instant.now().toString()
        ));
    }

    @GetMapping("/health/ready")
    public ResponseEntity<Map<String, Object>> readiness() {
        boolean dbHealthy = checkDatabase();
        boolean mlHealthy = mlServiceClient.healthCheck();

        String status = dbHealthy && mlHealthy ? "UP" : "DOWN";
        int httpStatus = dbHealthy && mlHealthy ? 200 : 503;
        
        return ResponseEntity.status(httpStatus).body(Map.of(
                "status", status,
                "service", "jalrakshak-backend",
                "timestamp", Instant.now().toString(),
                "checks", Map.of(
                        "database", dbHealthy ? "UP" : "DOWN",
                        "ml-service", mlHealthy ? "UP" : "DOWN"
                )
        ));
    }

    private boolean checkDatabase() {
        try (Connection conn = dataSource.getConnection()) {
            return conn.isValid(2);
        } catch (Exception e) {
            return false;
        }
    }
}