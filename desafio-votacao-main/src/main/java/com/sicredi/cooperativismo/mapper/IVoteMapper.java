package com.sicredi.cooperativismo.mapper;

import com.sicredi.cooperativismo.domain.Vote;
import com.sicredi.cooperativismo.dto.request.VoteRequest;
import com.sicredi.cooperativismo.dto.response.VoteResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IVoteMapper {

    @Mapping(source = "affiliatedId", target = "affiliated.id")
    Vote voteRequestToVote(VoteRequest voteRequest);
    VoteResponse voteToVoteResponse(Vote vote);
}
