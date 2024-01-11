package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.dto.request.MeetingRequest;
import com.sicredi.cooperativismo.dto.response.MeetingResponse;

public interface IMeetingService {

    MeetingResponse createMeeting(MeetingRequest meetingRequest);
    MeetingResponse getMeetingById(Long id);
    void endMeeting(Long id);
}
