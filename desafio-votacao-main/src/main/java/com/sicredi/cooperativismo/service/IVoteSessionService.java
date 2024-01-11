package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.dto.request.VoteSessionRequest;
import com.sicredi.cooperativismo.dto.response.VoteSessionResponse;
import com.sicredi.cooperativismo.dto.response.VoteSessionResultResponse;

public interface IVoteSessionService {

    VoteSessionResponse createVoteSession(VoteSessionRequest voteSessionRequest);
    VoteSessionResponse getVoteSessionById(Long id);
    void endVoteSession(Long id);
    VoteSessionResultResponse getVoteSessionResults(Long voteSessionId);
}
