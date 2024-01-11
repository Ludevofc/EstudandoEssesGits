package com.sicredi.cooperativismo.mapper;

import com.sicredi.cooperativismo.domain.Affiliated;
import com.sicredi.cooperativismo.dto.request.AffiliatedRequest;
import com.sicredi.cooperativismo.dto.response.AffiliatedResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface IAffiliatedMapper {

    Affiliated affiliatedRequestToAffiliated(AffiliatedRequest affiliatedRequest);
    AffiliatedResponse affiliatedToAffiliatedResponse(Affiliated affiliated);
}
