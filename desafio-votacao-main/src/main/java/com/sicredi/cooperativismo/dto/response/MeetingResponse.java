package com.sicredi.cooperativismo.dto.response;

import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.enums.MeetingStatusEnum;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MeetingResponse {

    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private MeetingStatusEnum status;
    private List<Topic> topics;
}
