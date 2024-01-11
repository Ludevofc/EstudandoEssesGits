package com.sicredi.cooperativismo.handler;

import com.sicredi.cooperativismo.dto.response.BadRequestExceptionResponse;
import com.sicredi.cooperativismo.dto.response.NotFoundExceptionResponse;
import com.sicredi.cooperativismo.exceptions.BadRequestException;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<NotFoundExceptionResponse> handleNotFoundException(NotFoundException exception) {
        return new ResponseEntity<>(NotFoundExceptionResponse.builder()
                .title(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(exception.getMessage())
                .statusCode(HttpStatus.NOT_FOUND.value())
                .dateTime(LocalDateTime.now())
                .build(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<BadRequestExceptionResponse> handleBadRequestException(BadRequestException exception) {
        return new ResponseEntity<>(BadRequestExceptionResponse.builder()
                .title(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(exception.getMessage())
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .dateTime(LocalDateTime.now())
                .build(), HttpStatus.BAD_REQUEST);
    }
}
