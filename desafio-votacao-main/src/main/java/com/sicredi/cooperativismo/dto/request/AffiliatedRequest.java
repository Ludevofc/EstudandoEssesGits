package com.sicredi.cooperativismo.dto.request;

import com.sicredi.cooperativismo.enums.AffiliatedStatusEnum;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AffiliatedRequest {

    private String name;
    private String document;
    private AffiliatedStatusEnum canVote;
}
