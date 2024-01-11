/*
 * Copyright (c) 2022, Alphabirdz. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 */

package com.alphabirdz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import com.alphabirdz.model.Post;
import com.alphabirdz.repository.PostRepository;

/**
 * The {@code PostRestController} class controls requisitions,
 * (ID's and others in this case), and returns one or more Posts.
 * The class includes methods for returning .json of 
 * all Posts, a Post by ID and others.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code RestController} aka
 * (RESTful service).
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 * @see com.alphabirdz.Post
 */

@RestController
@CrossOrigin(origins = "https://alphabirdz-spring.onrender.com")
@RequestMapping("/posts")
public class PostRestController {

    /**
     * Calls the PostRepository class to use its methods.
     */
    @Autowired
    private PostRepository postRepository;

    /**
     * Return all Birds accordingly to declared rules.
     * <p>
     * The method also includes a marker annotation that indicates
     * that the annotated class uses {@code RequestMapping}
     * which maps the URL.
     */
    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Post>> getAllPosts(){
        final List<Post> posts = new ArrayList<Post>(); 
        posts.addAll(this.postRepository.findAll());
        if(posts.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    /**
     * Search the Post ID inserted requisition,
     * and return the expected Post accordingly
     * to declared rules.
     * <p>
     * The method also includes a marker annotation that indicates
     * that the annotated class uses {@code RequestMapping}
     * which maps the URL.
     * 
     * @param postId
     *             The Post ID inserted.
     */
    @RequestMapping( value = "/id/{postId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Post> getPostById(final @PathVariable long postId){
        final Post id = postRepository.findById(postId);
        if(id == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @RequestMapping (value = "/add", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Post> saveUser(@RequestBody Post post){
        Post savedPost = postRepository.save(post);
        return new ResponseEntity<>(savedPost, HttpStatus.OK);
    }
}
