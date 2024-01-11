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

import java.util.List;

import com.alphabirdz.model.Bird;
import com.alphabirdz.repository.BirdRepository;

/**
 * The {@code BirdRestController} class controls requisitions,
 * (ID's, Names and others in this case), and returns one or more Birds.
 * The class includes methods for returning .json of 
 * all Birds, a Bird by ID, a Bird by Name, and others.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code RestController} aka
 * (RESTful service).
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 * @see com.alphabirdz.Bird
 */

@RestController
@CrossOrigin(origins = "https://alphabirdz-spring.onrender.com")
@RequestMapping("/birds")
public class BirdRestController {

    /**
     * Calls the BirdRepository class to use its methods.
     */
    @Autowired
    private BirdRepository birdRepository;

    /**
     * Return all Birds accordingly to declared rules.
     * <p>
     * The method also includes a marker annotation that indicates
     * that the annotated class uses {@code RequestMapping}
     * which maps the URL.
     */
    @RequestMapping( value = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Bird>> getAllBirds(){
        final List<Bird> bird = birdRepository.findAll();
        if(bird.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(bird, HttpStatus.OK);
    }

    /**
     * Search the Bird ID inserted requisition,
     * and return the expected Bird accordingly
     * to declared rules.
     * <p>
     * The method also includes a marker annotation that indicates
     * that the annotated class uses {@code RequestMapping}
     * which maps the URL.
     * 
     * @param birdId
     *             The Bird ID inserted.
     */
    @RequestMapping( value = "/id/{birdId}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Bird> getBirdById(final @PathVariable long birdId){
        final Bird bird = birdRepository.findById(birdId);
        if(bird == null){
            return new ResponseEntity<Bird>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Bird>(bird, HttpStatus.OK);
    }

    /**
     * Search the Bird english name inserted requisition,
     * and return the expected Bird accordingly 
     * to declared rules.
     * <p>
     * The method also includes a marker annotation that indicates
     * that the annotated class uses {@code RequestMapping}
     * which maps the URL.
     * 
     * @param birdEnglishName
     *             The Bird english name inserted.
     */
    @RequestMapping( value = "/enname/{birdEnglishName}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Bird> getBirdByEnglishName(final @PathVariable String birdEnglishName){
        Bird bird = birdRepository.findByEnglishName(birdEnglishName);
        if(bird == null){
            return new ResponseEntity<Bird>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Bird>(bird, HttpStatus.OK);
    }

    /**
     * Verify the API status.
     */
    @RequestMapping( value = "/ison", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String isResponding(){
        return "Server is responding to request!";
    }
}
