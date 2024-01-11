package com.sicredi.cooperativismo.domain;

import com.sicredi.cooperativismo.enums.VoteValueEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vote")
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "vote_value")
    private VoteValueEnum value;

    @OneToOne
    @JoinTable(name = "vote_affiliated", joinColumns = @JoinColumn(name = "vote_id"),
            inverseJoinColumns = @JoinColumn(name = "affiliated_id"))
    private Affiliated affiliated;
}
