package com.sicredi.cooperativismo.infra;

import com.sicredi.cooperativismo.domain.Affiliated;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAffiliatedRepository extends JpaRepository<Affiliated, Long> {
}
