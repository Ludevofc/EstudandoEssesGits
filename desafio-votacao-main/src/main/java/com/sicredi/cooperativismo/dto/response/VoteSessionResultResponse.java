package com.sicredi.cooperativismo.dto.response;

import com.sicredi.cooperativismo.enums.VoteSessionStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class VoteSessionResultResponse {
    private VoteSessionStatusEnum status;
    private long totalVotes;
    private long yesVotes;
    private long noVotes;
}
