package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.domain.VoteSession;
import com.sicredi.cooperativismo.dto.request.VoteSessionRequest;
import com.sicredi.cooperativismo.dto.response.VoteSessionResponse;
import com.sicredi.cooperativismo.dto.response.VoteSessionResultResponse;
import com.sicredi.cooperativismo.enums.TopicStatusEnum;
import com.sicredi.cooperativismo.enums.VoteSessionStatusEnum;
import com.sicredi.cooperativismo.enums.VoteValueEnum;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import com.sicredi.cooperativismo.infra.IVoteSessionRepository;
import com.sicredi.cooperativismo.mapper.IVoteSessionMapper;
import com.sicredi.cooperativismo.validation.TopicValidationService;
import com.sicredi.cooperativismo.validation.VoteSessionValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VoteSessionService implements IVoteSessionService {

    private final IVoteSessionRepository voteSessionRepository;

    private final IVoteSessionMapper voteSessionMapper;

    private final TopicService topicService;

    @Override
    public VoteSessionResponse createVoteSession(VoteSessionRequest voteSessionRequest) {
        Topic topic = topicService.getById(voteSessionRequest.getTopicId());
        TopicValidationService.validateTopicStatus(topic);

        VoteSession voteSession = voteSessionMapper.voteSessionRequestToVoteSession(voteSessionRequest);
        topic.setStatus(TopicStatusEnum.VOTING);

        return this.voteSessionMapper.voteSessionToVoteSessionResponse(voteSessionRepository.save(voteSession));
    }

    @Override
    public VoteSessionResponse getVoteSessionById(Long id) {
        VoteSession voteSession = getById(id);
        return this.voteSessionMapper.voteSessionToVoteSessionResponse(voteSession);
    }

    public VoteSession getById(Long id) {
        return this.voteSessionRepository.findById(id).orElseThrow(() -> new NotFoundException("A sessão de votação não foi encontrada."));
    }

    @Override
    public void endVoteSession(Long id) {
        VoteSession voteSession = this.getById(id);
        VoteSessionValidationService.validateVoteSessionStatusToVoteOrEnd(voteSession);

        VoteSessionResultResponse result = this.calculateVoteSessionResults(voteSession);

        voteSession.setEndTime(LocalDateTime.now());
        voteSession.setStatus(result.getStatus());
        voteSessionRepository.save(voteSession);
    }

    @Override
    public VoteSessionResultResponse getVoteSessionResults(Long voteSessionId) {
        VoteSession voteSession = this.getById(voteSessionId);
        VoteSessionValidationService.validateVoteSessionStatusToGetResults(voteSession);

        return this.calculateVoteSessionResults(voteSession);
    }

    private VoteSessionResultResponse calculateVoteSessionResults(VoteSession voteSession) {
        long totalVotes = voteSession.getVotes().size();
        long yesVotes = voteSession.getVotes().stream().filter(vote -> vote.getValue().equals(VoteValueEnum.YES)).count();
        long noVotes = voteSession.getVotes().stream().filter(vote -> vote.getValue().equals(VoteValueEnum.NO)).count();

        VoteSessionStatusEnum status = yesVotes > noVotes ? VoteSessionStatusEnum.APPROVED : noVotes > yesVotes ? VoteSessionStatusEnum.REFUSED : VoteSessionStatusEnum.TIED;

        return new VoteSessionResultResponse(status, totalVotes, yesVotes, noVotes);
    }
}
