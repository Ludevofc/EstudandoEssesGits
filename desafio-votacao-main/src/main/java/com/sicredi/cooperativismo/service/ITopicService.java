package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.dto.request.TopicRequest;
import com.sicredi.cooperativismo.dto.response.TopicResponse;

public interface ITopicService {
    TopicResponse createTopic(TopicRequest topicRequest);
    TopicResponse getTopicById(Long id);
}
