package com.sicredi.cooperativismo.api;

import com.sicredi.cooperativismo.dto.request.TopicRequest;
import com.sicredi.cooperativismo.dto.response.TopicResponse;
import com.sicredi.cooperativismo.service.ITopicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/topics")
@Tag(name = "Pauta")
public class TopicController {

    @Autowired
    private ITopicService topicService;

    @Operation(summary = "Cria uma nova Pauta em uma Assembleia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Caso a Pauta seja criada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso os dados informados sejam inválidos.")
    })
    @PostMapping()
    public ResponseEntity<TopicResponse> createTopic(@RequestBody @Valid TopicRequest topicRequest) {
        return new ResponseEntity<>(this.topicService.createTopic(topicRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Busca uma Pauta pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caso a Pauta seja encontrada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso o ID informado seja inválido."),
            @ApiResponse(responseCode = "404", description = "Caso não seja encontrada uma Pauta com o ID informado.")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TopicResponse> getTopicById(@PathVariable Long id) {
        return new ResponseEntity<>(topicService.getTopicById(id), HttpStatus.OK);
    }
}
