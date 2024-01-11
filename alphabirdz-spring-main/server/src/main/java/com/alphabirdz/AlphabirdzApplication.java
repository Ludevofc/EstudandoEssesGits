/*
 * Copyright (c) 2022, Alphabirdz. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 */

package com.alphabirdz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * The {@code Alphabirdz} class is the main class of the application.
 * <p>
 * The class includes a marker annotation that indicates
 * that the annotated class is a {@code SpringBootAplication} declaring that
 * the class is a Spring Boot application.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code EnableSwagger2} declaring that
 * the class has configured documentation.
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 */

@SpringBootApplication
@EnableSwagger2
public class AlphabirdzApplication {

	/**
	 * The main method of the application.
	 * @param args
	 */
	public static void main(String[] args) {
		SpringApplication.run(AlphabirdzApplication.class, args);
	}
}