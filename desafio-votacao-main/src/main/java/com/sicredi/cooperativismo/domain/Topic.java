package com.sicredi.cooperativismo.domain;

import com.sicredi.cooperativismo.enums.TopicStatusEnum;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "topic")
@Entity
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private TopicStatusEnum status = TopicStatusEnum.IN_PROGRESS;
}
