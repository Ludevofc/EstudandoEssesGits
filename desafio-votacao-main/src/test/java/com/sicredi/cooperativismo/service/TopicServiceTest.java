package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.domain.Meeting;
import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.dto.request.TopicRequest;
import com.sicredi.cooperativismo.dto.response.TopicResponse;
import com.sicredi.cooperativismo.enums.MeetingStatusEnum;
import com.sicredi.cooperativismo.enums.TopicStatusEnum;
import com.sicredi.cooperativismo.exceptions.BadRequestException;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import com.sicredi.cooperativismo.infra.ITopicRepository;
import com.sicredi.cooperativismo.mapper.ITopicMapper;
import com.sicredi.cooperativismo.stubs.IMeetingStub;
import com.sicredi.cooperativismo.stubs.ITopicStub;
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
class TopicServiceTest {

    @InjectMocks
    private TopicService topicService;
    @Mock
    private ITopicRepository topicRepository;
    @Mock
    private MeetingService meetingService;
    @Mock
    private ITopicMapper topicMapper;

    private Meeting meeting;
    private Topic topic;
    private TopicRequest topicRequest;
    private TopicResponse topicResponse;
    @BeforeEach
    void setup() {
        this.meeting = IMeetingStub.buildMeeting();
        this.topic = ITopicStub.buildTopic();
        this.topicRequest = ITopicStub.buildTopicRequest();
        this.topicResponse = ITopicStub.buildTopicResponse();
    }

    @Test
    void shouldCreateTopic() {
        when(meetingService.getById(1L)).thenReturn(meeting);
        when(topicMapper.topicRequestToTopic(topicRequest)).thenReturn(topic);
        when(topicRepository.save(any(Topic.class))).thenReturn(topic);
        when(topicMapper.topicToTopicResponse(topic)).thenReturn(topicResponse);

        TopicResponse savedTopic = topicService.createTopic(topicRequest);

        assertAll("createTopic",
                () -> assertEquals(topicRequest.getTitle(), savedTopic.getTitle()),
                () -> assertEquals(TopicStatusEnum.IN_PROGRESS, savedTopic.getStatus()),
                () -> assertEquals(meeting.getTopics().get(0).getId(), savedTopic.getId()));
        verify(topicRepository).save(any(Topic.class));
    }

    @Test
    void shouldReturnNotFoundExceptionWhenCreatingTopicAndMeetingDoesNotExist() {
        topicRequest = new TopicRequest(666L, "Topic Two");
        when(meetingService.getById(666L)).thenThrow(NotFoundException.class);

        assertThrows(NotFoundException.class, () -> topicService.createTopic(topicRequest));
        verify(meetingService).getById(666L);
    }

    @Test
    void shouldReturnBadRequestExceptionWhenCreatingTopicForAMeetingThatHasBeenFinished() {
        meeting.setStatus(MeetingStatusEnum.ENDED);
        when(meetingService.getById(1L)).thenReturn(meeting);

        assertThrows(BadRequestException.class, () -> topicService.createTopic(topicRequest));
        verify(meetingService).getById(1L);
    }

    @Test
    void shouldGetTopicById() {
        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        Topic secondTopic = topicService.getById(1L);

        assertEquals(topic.getId(), secondTopic.getId());
        verify(topicRepository).findById(1L);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenGettingVoteSessionByNonExistingId() {
        when(topicRepository.findById(666L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> topicService.getById(666L));
        verify(topicRepository).findById(666L);
    }
}