package com.sicredi.cooperativismo.dto.response;

import com.sicredi.cooperativismo.enums.AffiliatedStatusEnum;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AffiliatedResponse {

    private Long id;
    private String name;
    private String document;
    private AffiliatedStatusEnum canVote;

}
