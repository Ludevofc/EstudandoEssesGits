package com.sicredi.cooperativismo.stubs;

import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.dto.request.TopicRequest;
import com.sicredi.cooperativismo.dto.response.TopicResponse;
import com.sicredi.cooperativismo.enums.TopicStatusEnum;

public interface ITopicStub {

    static Topic buildTopic() {
        return Topic.builder()
                .id(1L)
                .title("Topic One")
                .status(TopicStatusEnum.IN_PROGRESS)
                .build();
    }

    static TopicRequest buildTopicRequest() {
        return TopicRequest.builder()
                .meetingId(1L)
                .title("Topic One")
                .build();
    }

    static TopicResponse buildTopicResponse() {
        return TopicResponse.builder()
                .id(1L)
                .title("Topic One")
                .status(TopicStatusEnum.IN_PROGRESS)
                .build();
    }
}
