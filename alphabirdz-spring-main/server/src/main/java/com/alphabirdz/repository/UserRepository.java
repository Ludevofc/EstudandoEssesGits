/*
 * Copyright (c) 2022, Alphabirdz. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 */

package com.alphabirdz.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.alphabirdz.model.User;

/**
 * The {@code UserRepository} class is a repository that
 * extends the CrudRepository interface.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code Repository} declaring that
 * the class is a repository.
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 * @see com.alphabirdz.User
 */

@Repository
public interface UserRepository extends CrudRepository<User, Long> {    

    /**
     * Returns a User by its username.
     * @param username
     */
    User findByUsername(String username);

    /**
     * Returns a User by its email.
     * @param email
     */
    User findByEmail(String email);

    /**
     * Returns a User by its id.
     * @param id
     */
    User findById(long id);

    /**
     * Returns a list of all Users.
     */
    List<User> findAll();
}
