package com.sicredi.cooperativismo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotFoundExceptionResponse {

    private String title;
    private String message;
    private Integer statusCode;
    private LocalDateTime dateTime;

}
