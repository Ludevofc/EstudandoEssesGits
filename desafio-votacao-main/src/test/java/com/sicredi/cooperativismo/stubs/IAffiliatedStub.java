package com.sicredi.cooperativismo.stubs;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.dto.request.AffiliatedRequest;
import com.sicredi.cooperativismo.dto.response.AffiliatedResponse;
import com.sicredi.cooperativismo.enums.AffiliatedStatusEnum;

public interface IAffiliatedStub {

    static Affiliated buildAffiliated() {
        return Affiliated.builder()
                .id(1L)
                .name("Jullie")
                .canVote(AffiliatedStatusEnum.CAN_VOTE)
                .document("01234567891")
                .build();
    }

    static AffiliatedRequest buildAffiliatedRequest() {
        return AffiliatedRequest.builder()
                .name("Jullie")
                .canVote(AffiliatedStatusEnum.CAN_VOTE)
                .document("01234567891")
                .build();
    }

    static AffiliatedResponse buildAffiliatedResponse() {
        return AffiliatedResponse.builder()
                .id(1L)
                .name("Jullie")
                .canVote(AffiliatedStatusEnum.CAN_VOTE)
                .document("01234567891")
                .build();
    }
}
