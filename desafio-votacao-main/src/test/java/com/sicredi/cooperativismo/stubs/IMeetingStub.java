package com.sicredi.cooperativismo.stubs;

import com.sicredi.cooperativismo.domain.Meeting;
import com.sicredi.cooperativismo.dto.request.MeetingRequest;
import com.sicredi.cooperativismo.dto.response.MeetingResponse;
import com.sicredi.cooperativismo.enums.MeetingStatusEnum;

import java.time.LocalDateTime;
import java.util.ArrayList;

public interface IMeetingStub {

    static Meeting buildMeeting() {
        return Meeting.builder()
                .id(1L)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusMinutes(1))
                .status(MeetingStatusEnum.STARTED)
                .topics(new ArrayList<>())
                .build();
    }

    static MeetingRequest buildMeetingRequest() {
        return MeetingRequest.builder()
                .endTime(LocalDateTime.now().plusMinutes(1))
                .build();
    }

    static MeetingResponse buildMeetingResponse() {
        return MeetingResponse.builder()
                .id(1L)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusMinutes(1))
                .status(MeetingStatusEnum.STARTED)
                .topics(new ArrayList<>())
                .build();
    }
}
