/*
 * Copyright (c) 2022, Alphabirdz. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 */

package com.alphabirdz.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * The {@code Bird} represents a Bird and stores its attributes.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code Entity} declaring that
 * the class is a JPA entity.
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 * @see com.alphabirdz.BirdRepository
 */

@Entity
@Table(name = "birds")
public class Bird {

    /**
     * Atributes of the Bird.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url")
    private String image;

    @Column(name = "english_name")
    private String englishName;

    @Column(name = "latin_name")
    private String latinName;

    @Column(name = "portuguese_name")
    private String portugueseName;

    @Column(name = "dominant_color")
    private String dominantColor;

    private String gender;
    private String habitat;
    private String family;

    @Column(name = "bird_size")
    private String birdSize;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "bird")
    private Set<Post> posts;

    /**
     * Constructs a new {@code Bird} with the specified attributes.
     * @param englishName
     * @param latinName
     * @param portugueseName
     * @param dominantColor
     * @param habitat
     * @param family
     * @param birdSize
     */
    public Bird(String englishName, String latinName, String portugueseName, String dominantColor, String habitat, String family, String birdSize) {
        this.englishName = englishName;
        this.latinName = latinName;
        this.portugueseName = portugueseName;
        this.dominantColor = dominantColor;
        this.habitat = habitat;
        this.family = family;
        this.birdSize = birdSize;
    }

    /**
     * Empty constructor.
     */
    protected Bird(){
    }

    /**
     * Getters.
     */
    public Long getId() {
        return this.id;
    }

    public String getImage() {
        return image;
    }

    public String getEnglishName() {
        return englishName;
    }

    public String getlatinName() {
        return latinName;
    }

    public String getPortugueseName() {
        return portugueseName;
    }

    public String getDominantColor() {
        return dominantColor;
    }

    public String getGender() {
        return gender;
    }

    public String getHabitat() {
        return habitat;
    }

    public String getFamily() {
        return family;
    }

    public String getBirdSize() {
        return birdSize;
    }
}
