package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.dto.request.VoteRequest;
import com.sicredi.cooperativismo.dto.response.VoteResponse;

public interface IVoteService {

    VoteResponse vote(VoteRequest voteRequest);
    VoteResponse getVoteById(Long id);
}
