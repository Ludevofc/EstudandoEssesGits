package com.sicredi.cooperativismo.dto.response;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.enums.VoteValueEnum;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VoteResponse {

    private Long id;
    private VoteValueEnum value;
    private Affiliated affiliated;
    
}
