package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.domain.Vote;
import com.sicredi.cooperativismo.domain.VoteSession;
import com.sicredi.cooperativismo.dto.request.VoteSessionRequest;
import com.sicredi.cooperativismo.dto.response.VoteSessionResponse;
import com.sicredi.cooperativismo.dto.response.VoteSessionResultResponse;
import com.sicredi.cooperativismo.enums.TopicStatusEnum;
import com.sicredi.cooperativismo.enums.VoteSessionStatusEnum;
import com.sicredi.cooperativismo.enums.VoteValueEnum;
import com.sicredi.cooperativismo.exceptions.BadRequestException;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import com.sicredi.cooperativismo.infra.IVoteSessionRepository;
import com.sicredi.cooperativismo.mapper.IVoteSessionMapper;
import com.sicredi.cooperativismo.stubs.ITopicStub;
import com.sicredi.cooperativismo.stubs.IVoteSessionStub;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VoteSessionServiceTest {

    @InjectMocks
    private VoteSessionService voteSessionService;
    @Mock
    private TopicService topicService;
    @Mock
    private IVoteSessionRepository voteSessionRepository;
    @Spy
    private IVoteSessionMapper voteSessionMapper;

    private VoteSession voteSession;
    private VoteSessionRequest voteSessionRequest;
    private VoteSessionResponse voteSessionResponse;
    private Topic topic;

    @BeforeEach
    void setup() {
        this.voteSession = IVoteSessionStub.buildVoteSession();
        this.voteSessionRequest = IVoteSessionStub.buildVoteSessionRequest();
        this.voteSessionResponse = IVoteSessionStub.buildVoteSessionResponse();
        this.topic = ITopicStub.buildTopic();
    }

    @Test
    void shouldGetVoteSessionResults() {
        List<Vote> votes = new ArrayList<>();
        votes.add(new Vote(1L, VoteValueEnum.YES, new Affiliated()));
        votes.add(new Vote(2L, VoteValueEnum.YES, new Affiliated()));
        votes.add(new Vote(3L, VoteValueEnum.NO, new Affiliated()));
        voteSession.setVotes(votes);
        voteSession.setStatus(VoteSessionStatusEnum.APPROVED);

        when(voteSessionRepository.findById(1L)).thenReturn(Optional.of(voteSession));

        VoteSessionResultResponse result = voteSessionService.getVoteSessionResults(1L);

        assertAll("votingResult",
                () -> assertEquals(VoteSessionStatusEnum.APPROVED, result.getStatus()),
                () -> assertEquals(3, result.getTotalVotes()),
                () -> assertEquals(2, result.getYesVotes()),
                () -> assertEquals(1, result.getNoVotes())
        );
        verify(voteSessionRepository).findById(1L);
    }

    @Test
    void shouldThrowBadRequestExceptionWhenGettingResultsIfVoteSessionHasNotFinishedYet() {
        when(voteSessionRepository.findById(1L)).thenReturn(Optional.of(voteSession));

        assertThrows(BadRequestException.class, () -> voteSessionService.getVoteSessionResults(1L));
        verify(voteSessionRepository).findById(1L);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenGettingResultsIfVoteSessionDoesNotExist() {
        when(voteSessionRepository.findById(666L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> voteSessionService.getVoteSessionResults(666L));
        verify(voteSessionRepository).findById(666L);
    }

    @Test
    void shouldGetVoteSessionById() {
        when(voteSessionRepository.findById(1L)).thenReturn(Optional.of(voteSession));
        VoteSession secondVoteSession = voteSessionService.getById(1L);

        assertEquals(voteSession.getId(), secondVoteSession.getId());
        verify(voteSessionRepository).findById(1L);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenGettingVoteSessionByNonExistingId() {
        when(voteSessionRepository.findById(666L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> voteSessionService.getById(666L));
        verify(voteSessionRepository).findById(666L);
    }

    @Test
    void shouldCreateVoteSession() {
        when(topicService.getById(1L)).thenReturn(topic);
        when(voteSessionMapper.voteSessionRequestToVoteSession(voteSessionRequest)).thenReturn(voteSession);
        when(voteSessionRepository.save(any(VoteSession.class))).thenReturn(voteSession);
        when(voteSessionMapper.voteSessionToVoteSessionResponse(voteSession)).thenReturn(voteSessionResponse);

        VoteSessionResponse savedVoteSession = voteSessionService.createVoteSession(voteSessionRequest);

        assertAll("voteSession",
                () -> assertEquals(voteSessionRequest.getTopicId(), savedVoteSession.getTopic().getId()),
                () -> assertEquals(TopicStatusEnum.IN_PROGRESS, savedVoteSession.getTopic().getStatus()));
        verify(voteSessionRepository).save(any(VoteSession.class));
    }

    @Test
    void shouldReturnNotFoundExceptionWhenCreatingVoteSessionAndTopicDoesNotExist() {
        voteSessionRequest = new VoteSessionRequest(LocalDateTime.now().plusMinutes(1), 666L);
        when(topicService.getById(666L)).thenThrow(NotFoundException.class);

        assertThrows(NotFoundException.class, () -> voteSessionService.createVoteSession(voteSessionRequest));
        verify(topicService).getById(666L);
    }

    @Test
    void shouldReturnBadRequestExceptionWhenCreatingVoteSessionForATopicThatIsAlreadyInVoting() {
        topic.setStatus(TopicStatusEnum.VOTING);
        when(topicService.getById(1L)).thenReturn(topic);

        assertThrows(BadRequestException.class, () -> voteSessionService.createVoteSession(voteSessionRequest));
        verify(topicService).getById(1L);
    }

    @Test
    void shouldReturnBadRequestExceptionWhenCreatingVoteSessionForATopicThatHasBeenFinished() {
        topic.setStatus(TopicStatusEnum.FINISHED);
        when(topicService.getById(1L)).thenReturn(topic);

        assertThrows(BadRequestException.class, () -> voteSessionService.createVoteSession(voteSessionRequest));
        verify(topicService).getById(1L);
    }

    @Test
    void shouldEndVoteSession() {
        voteSession.getVotes().add(new Vote(1L, VoteValueEnum.YES, new Affiliated()));
        when(voteSessionRepository.findById(1L)).thenReturn(Optional.of(voteSession));

        voteSessionService.endVoteSession(1L);

        assertEquals(VoteSessionStatusEnum.APPROVED, voteSession.getStatus());
        verify(voteSessionRepository).findById(1L);
        verify(voteSessionRepository).save(voteSession);
    }

    @Test
    void shouldReturnBadRequestExceptionWhenEndingAVoteSessionThatIsAlreadyFinished() {
        voteSession.setStatus(VoteSessionStatusEnum.TIED);
        when(voteSessionRepository.findById(1L)).thenReturn(Optional.of(voteSession));

        assertThrows(BadRequestException.class, () -> voteSessionService.endVoteSession(1L));
        verify(voteSessionRepository).findById(1L);
    }

    @Test
    void shouldReturnNotFoundExceptionWhenEndingAVoteSessionThatDoesNotExist() {
        when(voteSessionRepository.findById(666L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> voteSessionService.endVoteSession(666L));
        verify(voteSessionRepository).findById(666L);
    }

}