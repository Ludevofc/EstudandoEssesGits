package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.domain.Meeting;
import com.sicredi.cooperativismo.dto.request.MeetingRequest;
import com.sicredi.cooperativismo.dto.response.MeetingResponse;
import com.sicredi.cooperativismo.enums.MeetingStatusEnum;
import com.sicredi.cooperativismo.exceptions.BadRequestException;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import com.sicredi.cooperativismo.infra.IMeetingRepository;
import com.sicredi.cooperativismo.mapper.IMeetingMapper;
import com.sicredi.cooperativismo.stubs.IMeetingStub;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MeetingServiceTest {

    @InjectMocks
    private MeetingService meetingService;
    @Mock
    private IMeetingRepository meetingRepository;
    @Spy
    private IMeetingMapper meetingMapper;

    private Meeting meeting;
    private MeetingRequest meetingRequest;
    private MeetingResponse meetingResponse;
    @BeforeEach()
    void setup() {
        this.meeting = IMeetingStub.buildMeeting();
        this.meetingRequest = IMeetingStub.buildMeetingRequest();
        this.meetingResponse = IMeetingStub.buildMeetingResponse();
    }

    @Test
    void shouldCreateMeeting() {
        when(meetingMapper.meetingRequestToMeeting(meetingRequest)).thenReturn(meeting);
        when(meetingRepository.save(any(Meeting.class))).thenReturn(meeting);
        when(meetingMapper.meetingToMeetingResponse(meeting)).thenReturn(meetingResponse);

        MeetingResponse savedMeeting = meetingService.createMeeting(meetingRequest);

        assertEquals(MeetingStatusEnum.STARTED, savedMeeting.getStatus());
        verify(meetingRepository).save(any(Meeting.class));
    }

    @Test
    void shouldGetMeetingById() {
        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        Meeting searchedMeeting = meetingService.getById(1L);

        assertEquals(meeting.getId(), searchedMeeting.getId());
        verify(meetingRepository).findById(1L);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenGettingMeetingByNonExistingId() {
        when(meetingRepository.findById(666L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> meetingService.getById(666L));
        verify(meetingRepository).findById(666L);
    }

    @Test
    void shouldEndMeeting() {
        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));

        meetingService.endMeeting(1L);

        assertEquals(MeetingStatusEnum.ENDED, meeting.getStatus());
        verify(meetingRepository).findById(1L);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenEndingMeetingThatDoesNotExist() {
        when(meetingRepository.findById(666L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> meetingService.endMeeting(666L));
        verify(meetingRepository).findById(666L);
    }

    @Test
    void shouldThrowBadRequestExceptionWhenEndingMeetingThatHasAlreadyFinished() {
        meeting.setStatus(MeetingStatusEnum.ENDED);
        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));

        assertThrows(BadRequestException.class, () -> meetingService.endMeeting(1L));
        verify(meetingRepository).findById(1L);
    }
}