/*
 * Copyright (c) 2022, Alphabirdz. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 */

package com.alphabirdz.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.alphabirdz.model.User;
import com.alphabirdz.repository.UserRepository;

/**
 * The {@code UserRestController} class controls requisitions,
 * (ID's, usernames and others in this case), and returns one or more Users.
 * The class includes methods for returning .json of 
 * all Users, a User by ID, a User by username and others.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code RestController} aka
 * (RESTful service).
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 * @see com.alphabirdz.User
 */

@RestController
@CrossOrigin(origins = "https://alphabirdz-spring.onrender.com")
@RequestMapping("/users")
public class UserRestController {
    /**
     * Calls the UserRepository class to use its methods.
     */
	@Autowired
    private UserRepository userRepository;

    /**
     * Return all Users accordingly to declared rules.
     * <p>
     * The method also includes a marker annotation that indicates
     * that the annotated class uses {@code RequestMapping}
     * which maps the URL.
     */
    @RequestMapping(value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<User>> getAllUsers(){
        final List<User> user = userRepository.findAll();
        if(user.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    /**
     * Search the User ID inserted requisition,
     * and return the expected User accordingly
     * to declared rules.
     * <p>
     * The method also includes a marker annotation that indicates
     * that the annotated class uses {@code RequestMapping}
     * which maps the URL.
     * 
     * @param userId
     *             The User ID inserted.
     */
    @RequestMapping( value = "/id/{userId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getId(final @PathVariable long userId){
        final User id = userRepository.findById(userId);
        if (id == null) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<User>(id, HttpStatus.OK);
	}

    /**
     * Search the Username inserted requisition,
     * and return the expected User accordingly
     * to declared rules.
     * <p>
     * The method also includes a marker annotation that indicates
     * that the annotated class uses {@code RequestMapping}
     * which maps the URL.
     * 
     * @param username
     *             The Username inserted.
     */
	@RequestMapping( value = "/name/{username}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> getUsername(final @PathVariable String username){
        final User name = userRepository.findByUsername(username);
        if (name == null){
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<User>(name, HttpStatus.OK);
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> loginUser(@RequestBody User user) {
        User userFound;

        try {
            userFound = userRepository.findByEmail(user.getEmail());
        }
        catch (Exception e) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
    }

        if (userFound == null){
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }else{
            if (userFound.getPassword().equals(user.getPassword())){
                user.setLoggedIn(true);
                return new ResponseEntity<User>(userFound, HttpStatus.OK);
            }
        }

        return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
    }
}