package com.sicredi.cooperativismo.mapper;

import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.dto.request.TopicRequest;
import com.sicredi.cooperativismo.dto.response.TopicResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ITopicMapper {

    Topic topicRequestToTopic(TopicRequest topicRequest);
    TopicResponse topicToTopicResponse(Topic topic);
}
