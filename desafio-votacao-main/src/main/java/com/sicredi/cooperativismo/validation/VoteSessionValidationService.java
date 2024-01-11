package com.sicredi.cooperativismo.validation;

import com.sicredi.cooperativismo.domain.VoteSession;
import com.sicredi.cooperativismo.enums.VoteSessionStatusEnum;
import com.sicredi.cooperativismo.exceptions.BadRequestException;

public class VoteSessionValidationService {

    public static void validateVoteSessionStatusToGetResults(VoteSession voteSession) {
        if (voteSession.getStatus().equals(VoteSessionStatusEnum.IN_PROGRESS))
            throw new BadRequestException("A sessão de votação ainda está em andamento.");
    }

    public static void validateVoteSessionStatusToVoteOrEnd(VoteSession voteSession) {
        if (!voteSession.getStatus().equals(VoteSessionStatusEnum.IN_PROGRESS))
            throw new BadRequestException("A sessão de votação já encerrou.");
    }
}
