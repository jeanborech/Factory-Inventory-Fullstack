package com.projectFullStack.factory_inventory.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArg(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(new ErrorResponse(ex.getMessage(), ex.toString()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream().map(fe -> fe.getField() + ": " + fe.getDefaultMessage()).collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(new ErrorResponse("Validation failed", details));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex) {
        // #region agent log
        try {
            String msg = ex.getMessage() != null ? ex.getMessage().replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ") : "null";
            String line = "{\"timestamp\":\"" + java.time.Instant.now() + "\",\"location\":\"GlobalExceptionHandler\",\"message\":\"handleAll\",\"data\":{\"exceptionClass\":\"" + ex.getClass().getName() + "\",\"exceptionMessage\":\"" + msg + "\"},\"hypothesisId\":\"H1,H2,H3,H5\"}\n";
            java.nio.file.Files.writeString(java.nio.file.Paths.get("c:\\PROJETOS_GERAIS\\factory-inventory\\.cursor\\debug.log"), line, java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
        } catch (Throwable ignore) {}
        // #endregion
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Internal error", ex.toString()));
    }
}

