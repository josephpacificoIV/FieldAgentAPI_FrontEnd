package learn.field_agent.controllers;


import learn.field_agent.domain.AgentService;
import learn.field_agent.domain.AliasService;
import learn.field_agent.domain.Result;
import learn.field_agent.domain.ResultType;
import learn.field_agent.models.Agent;
import learn.field_agent.models.Alias;
import learn.field_agent.models.SecurityClearance;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/alias")
public class AliasController {

    private final AliasService service;
    private final AgentService agentService;

    public AliasController(AliasService service, AgentService agentService) {
        this.service = service;
        this.agentService = agentService;
    }

    /*@GetMapping("/agent/{agentId}")
    public ResponseEntity<Agent> findById(@PathVariable int agentId) {
        Agent agent = agentService.findById(agentId);
        if (agent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(agent);
    }*/

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Alias alias) {
        Result<Alias> result = service.add(alias);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/{aliasId}")
    public ResponseEntity<Void> update(@PathVariable int aliasId, @RequestBody Alias alias) {

        // id conflict. stop immediately.
        if (aliasId != alias.getAliasId()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // 4. ResultType -> HttpStatus
        Result<Alias> result = service.update(alias);
        if (result.getType() == ResultType.INVALID) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (result.getType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{aliasId}")
    public ResponseEntity<Void> deleteById(@PathVariable int aliasId) {
        if (service.deleteById(aliasId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


}
