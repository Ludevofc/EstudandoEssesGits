package com.sicredi.cooperativismo.dto.request;

import com.sicredi.cooperativismo.enums.VoteValueEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class VoteRequest {
    private VoteValueEnum value;
    private Long voteSessionId;
    private Long affiliatedId;
}
