package com.sicredi.cooperativismo.service;

import com.sicredi.cooperativismo.dto.request.AffiliatedRequest;
import com.sicredi.cooperativismo.dto.response.AffiliatedResponse;

public interface IAffiliatedService {

    AffiliatedResponse createAffiliated(AffiliatedRequest affiliatedRequest);
    AffiliatedResponse getAffiliatedById(Long id);
}
