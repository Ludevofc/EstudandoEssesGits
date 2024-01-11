/*
 * Copyright (c) 2022, Alphabirdz. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 */

package com.alphabirdz.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.alphabirdz.model.Post;

/**
 * The {@code PostRepository} class is a repository that
 * extends the CrudRepository interface.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code Repository} declaring that
 * the class is a repository.
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 * @see com.alphabirdz.Post
 */

@Repository
public interface PostRepository extends CrudRepository<Post, Long> {    

    /**
     * Returns a Post by its id.
     * @param id
     */
    Post findById(long id);

    /**
     * Returns a list of all Posts.
     */
    List<Post> findAll();
}