package com.sicredi.cooperativismo.api;

import com.sicredi.cooperativismo.dto.request.VoteRequest;
import com.sicredi.cooperativismo.dto.response.VoteResponse;
import com.sicredi.cooperativismo.service.IVoteService;
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
@RequestMapping("v1/votes")
@Tag(name = "Voto")
public class VoteController {

    @Autowired
    private IVoteService voteService;

    @Operation(summary = "Vota em uma Pauta")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Caso o Voto seja criado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso a Sessão de Votação já esteja encerrada, ou os dados informados sejam inválidos, ou Associado já votou."),
            @ApiResponse(responseCode = "404", description = "Caso o Associado ou a Sessão de Votação não forem encontrados.")
    })
    @PostMapping()
    public ResponseEntity<VoteResponse> vote(@RequestBody @Valid VoteRequest voteRequest) {
        return new ResponseEntity<>(this.voteService.vote(voteRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Busca um Voto pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caso o Voto seja encontrado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso o ID informado seja inválido."),
            @ApiResponse(responseCode = "404", description = "Caso não seja encontrado um Voto com o ID informado.")
    })
    @GetMapping("/{id}")
    public ResponseEntity<VoteResponse> getVoteById(@PathVariable Long id) {
        return new ResponseEntity<>(voteService.getVoteById(id), HttpStatus.OK);
    }
}
