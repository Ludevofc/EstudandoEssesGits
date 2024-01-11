package com.sicredi.cooperativismo.dto.response;

import com.sicredi.cooperativismo.enums.TopicStatusEnum;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopicResponse {

    private Long id;
    private String title;
    private TopicStatusEnum status;

}
