package com.sicredi.cooperativismo.mapper;

import com.sicredi.cooperativismo.domain.VoteSession;
import com.sicredi.cooperativismo.dto.request.VoteSessionRequest;
import com.sicredi.cooperativismo.dto.response.VoteSessionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;

@Mapper(imports = {LocalDateTime.class}, componentModel = "spring")
public interface IVoteSessionMapper {

    @Mapping(source = "topicId", target = "topic.id")
    @Mapping(defaultExpression = "java(LocalDateTime.now().plusMinutes(1))", source = "endTime", target = "endTime")
    VoteSession voteSessionRequestToVoteSession(VoteSessionRequest voteSessionRequest);
    VoteSessionResponse voteSessionToVoteSessionResponse(VoteSession voteSession);

}
