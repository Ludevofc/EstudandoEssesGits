package com.sicredi.cooperativismo.infra;

import com.sicredi.cooperativismo.domain.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IMeetingRepository extends JpaRepository<Meeting, Long> {
}
