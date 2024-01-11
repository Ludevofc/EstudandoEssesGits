package com.sicredi.cooperativismo.dto.response;

import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.enums.VoteSessionStatusEnum;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class VoteSessionResponse {

    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private VoteSessionStatusEnum status;
    private Topic topic;

}
