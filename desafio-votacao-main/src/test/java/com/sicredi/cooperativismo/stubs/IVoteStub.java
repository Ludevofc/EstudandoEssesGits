package com.sicredi.cooperativismo.stubs;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.domain.Vote;
import com.sicredi.cooperativismo.dto.request.VoteRequest;
import com.sicredi.cooperativismo.dto.response.VoteResponse;
import com.sicredi.cooperativismo.enums.AffiliatedStatusEnum;
import com.sicredi.cooperativismo.enums.VoteValueEnum;

public interface IVoteStub {

    static Vote buildVote() {
        return Vote.builder()
                .id(1L)
                .value(VoteValueEnum.YES)
                .affiliated(new Affiliated())
                .build();
    }

    static VoteRequest buildVoteRequest() {
        return VoteRequest.builder()
                .voteSessionId(1L)
                .affiliatedId(1L)
                .value(VoteValueEnum.YES)
                .build();
    }

    static VoteResponse buildVoteResponse() {
        return VoteResponse.builder()
                .id(1L)
                .value(VoteValueEnum.YES)
                .affiliated(new Affiliated(1L, "Jullie", "01234567891", AffiliatedStatusEnum.CAN_VOTE))
                .build();
    }
}
