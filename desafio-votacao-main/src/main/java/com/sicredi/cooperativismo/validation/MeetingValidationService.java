package com.sicredi.cooperativismo.validation;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.domain.Meeting;
import com.sicredi.cooperativismo.domain.VoteSession;
import com.sicredi.cooperativismo.enums.MeetingStatusEnum;
import com.sicredi.cooperativismo.exceptions.BadRequestException;

public class MeetingValidationService {

    public static void validateMeetingStatus(Meeting meeting) {
        if (meeting.getStatus().equals(MeetingStatusEnum.ENDED)) {
            throw new BadRequestException("Não foi possível criar a Pauta pois a assembleia já foi encerrada.");
        }
    }
}
