package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.domain.Vote;
import com.sicredi.cooperativismo.domain.VoteSession;
import com.sicredi.cooperativismo.dto.request.VoteRequest;
import com.sicredi.cooperativismo.dto.response.VoteResponse;
import com.sicredi.cooperativismo.enums.VoteSessionStatusEnum;
import com.sicredi.cooperativismo.enums.VoteValueEnum;
import com.sicredi.cooperativismo.exceptions.BadRequestException;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import com.sicredi.cooperativismo.infra.IVoteRepository;
import com.sicredi.cooperativismo.mapper.IVoteMapper;
import com.sicredi.cooperativismo.stubs.IAffiliatedStub;
import com.sicredi.cooperativismo.stubs.IVoteSessionStub;
import com.sicredi.cooperativismo.stubs.IVoteStub;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @InjectMocks
    private VoteService voteService;
    @Mock
    private IVoteRepository voteRepository;
    @Mock
    private AffiliatedService affiliatedService;
    @Mock
    private VoteSessionService voteSessionService;
    @Mock
    private IVoteMapper voteMapper;

    private Vote vote;
    private VoteRequest voteRequest;
    private VoteResponse voteResponse;
    private Affiliated affiliated;
    private VoteSession voteSession;

    @BeforeEach
    void setup() {
        this.vote = IVoteStub.buildVote();
        this.voteRequest = IVoteStub.buildVoteRequest();
        this.voteResponse = IVoteStub.buildVoteResponse();
        this.affiliated = IAffiliatedStub.buildAffiliated();
        this.voteSession = IVoteSessionStub.buildVoteSession();
    }

    @Test
    void shouldGetVoteById() {
        when(voteRepository.findById(1L)).thenReturn(Optional.of(vote));
        Vote secondVote = voteService.getById(1L);

        assertEquals(vote.getId(), secondVote.getId());
        verify(voteRepository).findById(1L);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenGettingVoteByNonExistingId() {
        when(voteRepository.findById(666L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> voteService.getById(666L));
        verify(voteRepository).findById(666L);
    }

    @Test
    void shouldVote() {
        when(affiliatedService.getById(1L)).thenReturn(affiliated);
        when(voteSessionService.getById(1L)).thenReturn(voteSession);
        when(voteMapper.voteRequestToVote(voteRequest)).thenReturn(vote);
        when(voteRepository.save(any(Vote.class))).thenReturn(vote);
        when(voteMapper.voteToVoteResponse(vote)).thenReturn(voteResponse);

        VoteResponse savedVote = voteService.vote(voteRequest);

        assertAll("vote",
                () -> assertEquals(voteRequest.getAffiliatedId(), savedVote.getAffiliated().getId()),
                () -> assertEquals(voteRequest.getValue(), savedVote.getValue()));
        verify(voteRepository).save(any(Vote.class));
    }

    @Test
    void shouldReturnNotFoundExceptionWhenVotingAndVoteSessionDoesNotExist() {
        voteRequest = new VoteRequest(VoteValueEnum.YES,666L, 1L);
        when(voteSessionService.getById(666L)).thenThrow(NotFoundException.class);

        assertThrows(NotFoundException.class, () -> voteService.vote(voteRequest));
        verify(voteSessionService).getById(666L);
    }

    @Test
    void shouldReturnNotFoundExceptionWhenVotingAndAffiliatedDoesNotExist() {
        voteRequest = new VoteRequest(VoteValueEnum.YES,1L, 666L);
        when(affiliatedService.getById(666L)).thenThrow(NotFoundException.class);

        assertThrows(NotFoundException.class, () -> voteService.vote(voteRequest));
        verify(affiliatedService).getById(666L);
    }

    @Test
    void shouldReturnBadRequestExceptionWhenVotingAndAffiliatedAlreadyHasVoted() {
        vote.setAffiliated(affiliated);
        voteSession.getVotes().add(vote);
        when(affiliatedService.getById(1L)).thenReturn(affiliated);
        when(voteSessionService.getById(1L)).thenReturn(voteSession);

        assertThrows(BadRequestException.class, () -> voteService.vote(voteRequest));

        verify(voteSessionService).getById(1L);
        verify(affiliatedService).getById(1L);
    }

    @Test
    void shouldReturnBadRequestExceptionWhenVotingAndVoteSessionHasAlreadyBeenEnded() {
        voteSession.setStatus(VoteSessionStatusEnum.APPROVED);
        when(affiliatedService.getById(1L)).thenReturn(affiliated);
        when(voteSessionService.getById(1L)).thenReturn(voteSession);

        assertThrows(BadRequestException.class, () -> voteService.vote(voteRequest));

        verify(voteSessionService).getById(1L);
        verify(affiliatedService).getById(1L);
    }
}