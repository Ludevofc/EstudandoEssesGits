package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.dto.request.AffiliatedRequest;
import com.sicredi.cooperativismo.dto.response.AffiliatedResponse;
import com.sicredi.cooperativismo.enums.AffiliatedStatusEnum;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import com.sicredi.cooperativismo.infra.IAffiliatedRepository;
import com.sicredi.cooperativismo.mapper.IAffiliatedMapper;
import com.sicredi.cooperativismo.stubs.IAffiliatedStub;
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
class AffiliatedServiceTest {

    @InjectMocks
    private AffiliatedService affiliatedService;
    @Mock
    private IAffiliatedRepository affiliatedRepository;
    @Mock
    private IAffiliatedMapper affiliatedMapper;

    private Affiliated affiliated;
    private AffiliatedRequest affiliatedRequest;
    private AffiliatedResponse affiliatedResponse;

    @BeforeEach
    void setup() {
        this.affiliated = IAffiliatedStub.buildAffiliated();
        this.affiliatedRequest = IAffiliatedStub.buildAffiliatedRequest();
        this.affiliatedResponse = IAffiliatedStub.buildAffiliatedResponse();
    }

    @Test
    void shouldCreateAffiliated() {
        when(affiliatedMapper.affiliatedRequestToAffiliated(affiliatedRequest)).thenReturn(affiliated);
        when(affiliatedRepository.save(any(Affiliated.class))).thenReturn(affiliated);
        when(affiliatedMapper.affiliatedToAffiliatedResponse(affiliated)).thenReturn(affiliatedResponse);

        AffiliatedResponse savedAffiliated = affiliatedService.createAffiliated(affiliatedRequest);

        assertAll("createAffiliated",
                () -> assertEquals(affiliatedRequest.getName(), savedAffiliated.getName()),
                () -> assertEquals(affiliatedRequest.getDocument(), savedAffiliated.getDocument()),
                () -> assertEquals(AffiliatedStatusEnum.CAN_VOTE, savedAffiliated.getCanVote()));
        verify(affiliatedRepository).save(any(Affiliated.class));
    }

    @Test
    void shouldGetAffiliatedById() {
        when(affiliatedRepository.findById(1L)).thenReturn(Optional.of(affiliated));
        Affiliated searchedAffiliated = affiliatedService.getById(1L);

        assertEquals(affiliated.getId(), searchedAffiliated.getId());
        verify(affiliatedRepository).findById(1L);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenGettingAffiliatedByNonExistingId() {
        when(affiliatedRepository.findById(666L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> affiliatedService.getById(666L));
        verify(affiliatedRepository).findById(666L);
    }
}