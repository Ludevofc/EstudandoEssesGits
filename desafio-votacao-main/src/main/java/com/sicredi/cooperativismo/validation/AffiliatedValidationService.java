package com.sicredi.cooperativismo.validation;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.domain.VoteSession;
import com.sicredi.cooperativismo.exceptions.BadRequestException;

public class AffiliatedValidationService {

    public static void validateAffiliatedVoteStatus(VoteSession voteSession, Affiliated affiliated) {
        if (voteSession.getVotes().stream().anyMatch(vote -> vote.getAffiliated().getId().equals(affiliated.getId()))) {
            throw new BadRequestException("O associado já votou nesta sessão.");
        }
    }
}
