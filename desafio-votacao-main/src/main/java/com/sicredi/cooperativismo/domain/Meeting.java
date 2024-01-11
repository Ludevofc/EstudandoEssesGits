package com.sicredi.cooperativismo.domain;

import com.sicredi.cooperativismo.enums.MeetingStatusEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "meeting")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private LocalDateTime startTime = LocalDateTime.now();

    private LocalDateTime endTime;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private MeetingStatusEnum status = MeetingStatusEnum.STARTED;

    @OneToMany
    @JoinTable(name = "meeting_topics", joinColumns = @JoinColumn(name = "meeting_id"),
            inverseJoinColumns = @JoinColumn(name = "topic_id"))
    private List<Topic> topics;
}

