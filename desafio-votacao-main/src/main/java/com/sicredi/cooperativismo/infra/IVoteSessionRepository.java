package com.sicredi.cooperativismo.infra;

import com.sicredi.cooperativismo.domain.VoteSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IVoteSessionRepository extends JpaRepository<VoteSession, Long> {

}