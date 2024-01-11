package com.sicredi.cooperativismo.api;

import com.sicredi.cooperativismo.dto.request.AffiliatedRequest;
import com.sicredi.cooperativismo.dto.response.AffiliatedResponse;
import com.sicredi.cooperativismo.service.IAffiliatedService;
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
@RequestMapping("v1/affiliateds")
@Tag(name = "Associado")
public class AffiliatedController {

    @Autowired
    private IAffiliatedService affiliatedService;

    @Operation(summary = "Cria um novo Associado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Caso o Associado seja criado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso os dados informados sejam inválidos.")
    })
    @PostMapping()
    public ResponseEntity<AffiliatedResponse> createAffiliated(@RequestBody @Valid AffiliatedRequest affiliatedRequest) {
        return new ResponseEntity<>(this.affiliatedService.createAffiliated(affiliatedRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Busca um Associado pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caso o Associado seja encontrado com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso o ID informado seja inválido."),
            @ApiResponse(responseCode = "404", description = "Caso não seja encontrado um Associado com o ID informado.")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AffiliatedResponse> getAffiliatedById(@PathVariable Long id) {
        return new ResponseEntity<>(affiliatedService.getAffiliatedById(id), HttpStatus.OK);
    }
}
