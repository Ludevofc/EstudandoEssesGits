package com.sicredi.cooperativismo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API para Votações em Assembleias.")
                        .contact(new Contact()
                                .name("Jullie Paixão")
                                .email("jullie.ferreira@db.tec.br")
                                .url("http://jullie.dev"))
                        .description("API desenvolvida para Votações em Assembleias")
                        .version("1.0.0")
                );
    }
}
