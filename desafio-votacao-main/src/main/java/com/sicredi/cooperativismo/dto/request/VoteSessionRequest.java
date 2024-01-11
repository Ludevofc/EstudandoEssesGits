package com.sicredi.cooperativismo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class VoteSessionRequest {

    private LocalDateTime endTime;

    private Long topicId;
}
