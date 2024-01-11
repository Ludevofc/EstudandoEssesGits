/*
 * Copyright (c) 2022, Alphabirdz. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 */

package com.alphabirdz;

import org.springframework.boot.actuate.autoconfigure.endpoint.web.CorsEndpointProperties;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties;
import org.springframework.boot.actuate.autoconfigure.web.server.ManagementPortType;
import org.springframework.boot.actuate.endpoint.ExposableEndpoint;
import org.springframework.boot.actuate.endpoint.web.EndpointLinksResolver;
import org.springframework.boot.actuate.endpoint.web.EndpointMapping;
import org.springframework.boot.actuate.endpoint.web.EndpointMediaTypes;
import org.springframework.boot.actuate.endpoint.web.ExposableWebEndpoint;
import org.springframework.boot.actuate.endpoint.web.WebEndpointsSupplier;
import org.springframework.boot.actuate.endpoint.web.annotation.ControllerEndpointsSupplier;
import org.springframework.boot.actuate.endpoint.web.annotation.ServletEndpointsSupplier;
import org.springframework.boot.actuate.endpoint.web.servlet.WebMvcEndpointHandlerMapping;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * The {@code SwaggerConfiguration} class is a configuration class that
 * configures the documentation.
 * <p>
 * The class includes a marker annotation that indicates
 * that the annotated class is a {@code Configuration} declaring that
 * the class is a configuration class.
 * <p>
 * The class also includes a marker annotation that indicates
 * that the annotated class is a {@code EnableSwagger2} declaring that
 * the class has configured documentation.
 *
 * @author Ariel Quaresma
 * @author Jullie Paixão
 * @author Kalebe Nascimento
 */

@Configuration
@EnableSwagger2
@ComponentScan(basePackages = "com.alphabirdz")
public class SwaggerConfiguration {

        /**
         * The method that configures the documentation.
         * @return
         */
        @Bean
        public Docket customDocket() {
                return new Docket(DocumentationType.SWAGGER_2).select()
                        .apis(RequestHandlerSelectors.basePackage("com.alphabirdz"))
                        .paths(PathSelectors.any()).build().apiInfo(getApiInfo());
        }

        /**
         * The method that configures the information of the documentation.
         */
        private ApiInfo getApiInfo() {
                return new ApiInfo(
                        "REST Alphabirdz backend API Documentation",
                          "This is a REST API documentation from Alphabirdz backend.",
                          "1.0",
                          "Alphabirdz backend terms of service",
                        new Contact(
                                "Alphabirdz",
                                "https://gitlab.com/alphabirdz",
                                "alphabirdzapi@gmail.com"),
                        "Apache 2.0",
                        "http://www.apache.org/licenses/LICENSE-2.0", Collections.emptyList());
        }

        /**
         * Configuring the documentation for the actuator endpoints.
         */
        @Bean
        public WebMvcEndpointHandlerMapping webEndpointServletHandlerMapping(WebEndpointsSupplier webEndpointsSupplier,
                 ServletEndpointsSupplier servletEndpointsSupplier, ControllerEndpointsSupplier controllerEndpointsSupplier,
                 EndpointMediaTypes endpointMediaTypes, CorsEndpointProperties corsProperties,
                 WebEndpointProperties webEndpointProperties, Environment environment) {
                        List<ExposableEndpoint<?>> allEndpoints = new ArrayList<>();
                        Collection<ExposableWebEndpoint> webEndpoints = webEndpointsSupplier.getEndpoints();
                        allEndpoints.addAll(webEndpoints);
                        allEndpoints.addAll(servletEndpointsSupplier.getEndpoints());
                        allEndpoints.addAll(controllerEndpointsSupplier.getEndpoints());
                        String basePath = webEndpointProperties.getBasePath();
                        EndpointMapping endpointMapping = new EndpointMapping(basePath);
                        boolean shouldRegisterLinksMapping = this.shouldRegisterLinksMapping(webEndpointProperties, environment, basePath);
                return new WebMvcEndpointHandlerMapping(endpointMapping, webEndpoints, endpointMediaTypes,
                        corsProperties.toCorsConfiguration(), new EndpointLinksResolver(allEndpoints, basePath), shouldRegisterLinksMapping, null);
    }

        private boolean shouldRegisterLinksMapping(WebEndpointProperties webEndpointProperties, Environment environment, String basePath) {
                return webEndpointProperties.getDiscovery().isEnabled() && (StringUtils.hasText(basePath)
                || ManagementPortType.get(environment).equals(ManagementPortType.DIFFERENT));
    }
}