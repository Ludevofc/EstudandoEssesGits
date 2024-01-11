package com.sicredi.cooperativismo.infra;

import com.sicredi.cooperativismo.domain.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IVoteRepository extends JpaRepository<Vote, Long> {

}
