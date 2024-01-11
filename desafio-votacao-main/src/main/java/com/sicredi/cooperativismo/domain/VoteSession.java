package com.sicredi.cooperativismo.domain;

import com.sicredi.cooperativismo.enums.VoteSessionStatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "vote_session")
public class VoteSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private LocalDateTime startTime = LocalDateTime.now();

    private LocalDateTime endTime;

    @Builder.Default
    private VoteSessionStatusEnum status = VoteSessionStatusEnum.IN_PROGRESS;

    @OneToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @OneToMany
    @JoinTable(name = "vote_session_votes", joinColumns = @JoinColumn(name = "vote_session_id"),
            inverseJoinColumns = @JoinColumn(name = "vote_id"))
    private List<Vote> votes;
}
