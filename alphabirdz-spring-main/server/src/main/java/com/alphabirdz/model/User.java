/*
 * Copyright (c) 2022, Alphabirdz. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 */

package com.alphabirdz.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 * The {@code User} represents a User and stores its attributes.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code Entity} declaring that
 * the class is a JPA entity.
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 * @see com.alphabirdz.UserRepository
 */

@Entity
@Table(name = "users")
public class User {

    /**
     * Atributes of the User.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profile_photo")
    private String profilePhoto;

    private String username;
    private String email;
    private String password;
    private Boolean loggedIn;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private Set<Post> posts;

    /**
     * Constructs a new {@code User} with the specified attributes.
     * @param profilePhoto
     * @param username
     * @param email
     * @param password
     */
    public User(String profilePhoto, String username, String email, String password) {
        this.profilePhoto = profilePhoto;
        this.username = username;
        this.email = email;
        this.password = password;
        this.loggedIn = false;
    }

    /**
     * Empty constructor.
     */
    protected User() {

    }

    /**
     * Getters.
     */
    public Long getId() {
        return id;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setLoggedIn(boolean loggedIn) {
        this.loggedIn = loggedIn;
    }

    // @Override
    // public boolean equals(Object o) {
    //     if (this == o) return true;
    //     if (!(o instanceof User)) return false;
    //     User user = (User) o;
    //     return Objects.equals(username, user.username) &&
    //             Objects.equals(password, user.password);
    // }

    @Override
    public String toString() {
        return String.format(
                "User[id=%d, profilePhoto='%s', username='%s', email='%s', password='%s']",
                id, profilePhoto, username, email, password);
    }
}