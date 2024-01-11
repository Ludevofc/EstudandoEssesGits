package com.sicredi.cooperativismo.api;

import com.sicredi.cooperativismo.dto.request.VoteSessionRequest;
import com.sicredi.cooperativismo.dto.response.VoteSessionResponse;
import com.sicredi.cooperativismo.dto.response.VoteSessionResultResponse;
import com.sicredi.cooperativismo.service.IVoteSessionService;
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
@RequestMapping("v1/vote-sessions")
@Tag(name = "Sessão de Votação")
public class VoteSessionController {

    @Autowired
    private IVoteSessionService voteSessionService;

    @Operation(summary = "Cria uma nova Sessão de Votação em uma Pauta")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Caso a Sessão seja criada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso os dados informados sejam inválidos.")
    })
    @PostMapping()
    public ResponseEntity<VoteSessionResponse> createVoteSession(@RequestBody @Valid VoteSessionRequest voteSessionRequest) {
        return new ResponseEntity<>(this.voteSessionService.createVoteSession(voteSessionRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Busca uma Sessão de Votação pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caso a Sessão seja encontrada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso o ID informado seja inválido."),
            @ApiResponse(responseCode = "404", description = "Caso não seja encontrada uma Sessão com o ID informado.")
    })
    @GetMapping("/{id}")
    public ResponseEntity<VoteSessionResponse> getVoteSessionById(@PathVariable Long id) {
        return new ResponseEntity<>(voteSessionService.getVoteSessionById(id), HttpStatus.OK);
    }

    @Operation(summary = "Busca o resultado da Sessão de Votação")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caso o resultado da Sessão seja buscado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso o ID informado seja inválido."),
            @ApiResponse(responseCode = "404", description = "Caso não seja encontrada uma Sessão com o ID informado.")
    })
    @GetMapping("/result/{id}")
    public ResponseEntity<VoteSessionResultResponse> getVoteSessionResults(@PathVariable Long id) {
        return new ResponseEntity<>(voteSessionService.getVoteSessionResults(id), HttpStatus.OK);
    }

    @Operation(summary = "Encerra uma Sessão de Votação")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caso a Sessão seja finalizada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso a Sessão já tenha sido encerrada ou o ID informado for inválido."),
            @ApiResponse(responseCode = "404", description = "Caso não seja encontrada uma Sessão com o ID informado.")
    })
    @PatchMapping("/end/{id}")
    public ResponseEntity<Void> endVoteSession(@PathVariable Long id) {
        voteSessionService.endVoteSession(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
