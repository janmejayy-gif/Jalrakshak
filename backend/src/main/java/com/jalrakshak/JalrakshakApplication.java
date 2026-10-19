package com.jalrakshak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.jalrakshak"})
public class JalrakshakApplication {

    public static void main(String[] args) {
        SpringApplication.run(JalrakshakApplication.class, args);
    }
}