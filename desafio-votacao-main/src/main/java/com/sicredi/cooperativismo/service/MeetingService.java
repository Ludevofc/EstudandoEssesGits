package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.domain.Meeting;
import com.sicredi.cooperativismo.dto.request.MeetingRequest;
import com.sicredi.cooperativismo.dto.response.MeetingResponse;
import com.sicredi.cooperativismo.enums.MeetingStatusEnum;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import com.sicredi.cooperativismo.infra.IMeetingRepository;
import com.sicredi.cooperativismo.mapper.IMeetingMapper;
import com.sicredi.cooperativismo.validation.MeetingValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MeetingService implements IMeetingService {

    private final IMeetingMapper meetingMapper;
    private final IMeetingRepository meetingRepository;

    public MeetingResponse createMeeting(MeetingRequest meetingRequest) {
        Meeting meeting = meetingMapper.meetingRequestToMeeting(meetingRequest);

        return this.meetingMapper.meetingToMeetingResponse(meetingRepository.save(meeting));
    }

    @Override
    public MeetingResponse getMeetingById(Long id) {
        Meeting meeting = getById(id);
        return this.meetingMapper.meetingToMeetingResponse(meeting);
    }

    public Meeting getById(Long id) {
        return this.meetingRepository.findById(id).orElseThrow(() -> new NotFoundException("A assembleia não foi encontrada."));
    }

    public void endMeeting(Long id) {
        Meeting meeting = this.getById(id);
        MeetingValidationService.validateMeetingStatus(meeting);

        meeting.setStatus(MeetingStatusEnum.ENDED);
        meeting.setEndTime(LocalDateTime.now());
        meetingRepository.save(meeting);
    }
}
