package com.sicredi.cooperativismo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TopicRequest {

    Long meetingId;
    String title;
}
