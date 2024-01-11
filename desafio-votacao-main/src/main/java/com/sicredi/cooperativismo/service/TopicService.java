package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.domain.Meeting;
import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.dto.request.TopicRequest;
import com.sicredi.cooperativismo.dto.response.TopicResponse;
import com.sicredi.cooperativismo.exceptions.NotFoundException;
import com.sicredi.cooperativismo.infra.ITopicRepository;
import com.sicredi.cooperativismo.mapper.ITopicMapper;
import com.sicredi.cooperativismo.validation.MeetingValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TopicService implements ITopicService {

    private final ITopicRepository topicRepository;

    private final ITopicMapper topicMapper;

    private final MeetingService meetingService;

    @Override
    public TopicResponse createTopic(TopicRequest topicRequest) {
        Meeting meeting = meetingService.getById(topicRequest.getMeetingId());
        MeetingValidationService.validateMeetingStatus(meeting);

        Topic topic = topicMapper.topicRequestToTopic(topicRequest);
        meeting.getTopics().add(topic);

        return this.topicMapper.topicToTopicResponse(topicRepository.save(topic));
    }

    @Override
    public TopicResponse getTopicById(Long id) {
        Topic topic = getById(id);
        return this.topicMapper.topicToTopicResponse(topic);
    }

    public Topic getById(Long id) {
        return this.topicRepository.findById(id).orElseThrow(() -> new NotFoundException("A pauta não foi encontrada."));
    }
}
