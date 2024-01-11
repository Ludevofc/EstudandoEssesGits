package com.sicredi.cooperativismo.validation;

import com.sicredi.cooperativismo.domain.Topic;
import com.sicredi.cooperativismo.enums.TopicStatusEnum;
import com.sicredi.cooperativismo.exceptions.BadRequestException;

public class TopicValidationService {

    public static void validateTopicStatus(Topic topic) {
        if(topic.getStatus().equals(TopicStatusEnum.VOTING)) {
            throw new BadRequestException("Não foi possível criar a sessão de votação pois já existe uma em andamento.");
        } else if(topic.getStatus().equals(TopicStatusEnum.FINISHED)) {
            throw new BadRequestException("Não foi possível criar a sessão de votação pois a pauta já foi encerrada.");
        }
    }
}
