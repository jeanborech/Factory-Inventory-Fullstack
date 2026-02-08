package com.projectFullStack.factory_inventory.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class ErrorResponse {
    private final Instant timestamp = Instant.now();
    private final String message;
    private final String details;
}

