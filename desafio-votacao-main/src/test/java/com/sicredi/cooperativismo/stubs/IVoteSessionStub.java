package com.sicredi.cooperativismo.stubs;

import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.domain.VoteSession;
import com.sicredi.cooperativismo.dto.request.VoteSessionRequest;
import com.sicredi.cooperativismo.dto.response.VoteSessionResponse;
import com.sicredi.cooperativismo.enums.TopicStatusEnum;
import com.sicredi.cooperativismo.enums.VoteSessionStatusEnum;

import java.time.LocalDateTime;
import java.util.ArrayList;

public interface IVoteSessionStub {

    static VoteSession buildVoteSession() {
        return VoteSession.builder()
                .id(1L)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusMinutes(2))
                .status(VoteSessionStatusEnum.IN_PROGRESS)
                .topic(new Topic(1L, "Topic One", TopicStatusEnum.IN_PROGRESS))
                .votes(new ArrayList<>())
                .build();
    }

    static VoteSessionRequest buildVoteSessionRequest() {
        return VoteSessionRequest.builder()
                .topicId(1L)
                .endTime(LocalDateTime.now().plusMinutes(2))
                .build();
    }

    static VoteSessionResponse buildVoteSessionResponse() {
        return VoteSessionResponse.builder()
                .id(1L)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusMinutes(2))
                .status(VoteSessionStatusEnum.IN_PROGRESS)
                .topic(new Topic(1L, "Topic One", TopicStatusEnum.IN_PROGRESS))
                .build();
    }
}
