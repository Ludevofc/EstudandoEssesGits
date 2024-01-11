package com.sicredi.cooperativismo.api;

import com.sicredi.cooperativismo.dto.request.MeetingRequest;
import com.sicredi.cooperativismo.dto.response.MeetingResponse;
import com.sicredi.cooperativismo.service.IMeetingService;
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
@RequestMapping("v1/meetings")
@Tag(name = "Assembleia")
public class MeetingController {

    @Autowired
    private IMeetingService meetingService;

    @Operation(summary = "Cria uma nova Assembleia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Caso a Assembleia seja criada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso os dados informados sejam inválidos.")
    })
    @PostMapping()
    public ResponseEntity<MeetingResponse> createMeeting(@RequestBody @Valid MeetingRequest meetingRequest) {
        return new ResponseEntity<>(meetingService.createMeeting(meetingRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Busca uma Assembleia pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caso a Assembleia seja encontrada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso o ID informado seja inválido."),
            @ApiResponse(responseCode = "404", description = "Caso não seja encontrada uma Assembleia com o ID informado.")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MeetingResponse> getMeetingById(@PathVariable Long id) {
        return new ResponseEntity<>(meetingService.getMeetingById(id), HttpStatus.OK);
    }

    @Operation(summary = "Encerra uma Assembleia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caso a Assembleia seja finalizada com sucesso."),
            @ApiResponse(responseCode = "400", description = "Caso a Assembleia já foi encerrada ou o ID informado for inválido."),
            @ApiResponse(responseCode = "404", description = "Caso não seja encontrada uma Assembleia com o ID informado.")
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Void> endMeeting(@PathVariable Long id) {
        meetingService.endMeeting(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
