package learn.field_agent.controllers;


import learn.field_agent.domain.Result;
import learn.field_agent.domain.ResultType;
import learn.field_agent.domain.SecurityClearanceService;
import learn.field_agent.models.Agency;
import learn.field_agent.models.SecurityClearance;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/security/clearance")
public class SecurityClearanceController {

    private final SecurityClearanceService securityClearanceService;

    public SecurityClearanceController(SecurityClearanceService securityClearanceService) {
        this.securityClearanceService = securityClearanceService;
    }

    @GetMapping
    public List<SecurityClearance> findAll() {
        return securityClearanceService.findAll();
    }

    @GetMapping("/{securityClearanceId}")
    public ResponseEntity<SecurityClearance> findById(@PathVariable int securityClearanceId) {
        SecurityClearance securityClearance = securityClearanceService.findById(securityClearanceId);
        if (securityClearance == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(securityClearance);
    }


    @PostMapping
    public ResponseEntity<SecurityClearance> add(@RequestBody SecurityClearance securityClearance) {
        Result<SecurityClearance> result = securityClearanceService.add(securityClearance);
        if (result.getType() == ResultType.INVALID) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PutMapping("/{security_clearance_id}")
    public ResponseEntity<Void> update(@PathVariable int security_clearance_id, @RequestBody SecurityClearance clearance) {

        // id conflict. stop immediately.
        if (security_clearance_id != clearance.getSecurityClearanceId()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // 4. ResultType -> HttpStatus
        Result<SecurityClearance> result = securityClearanceService.update(clearance);
        if (result.getType() == ResultType.INVALID) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (result.getType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{securityClearanceId}")
    public ResponseEntity<Void> deleteById(@PathVariable int securityClearanceId) {
        if (securityClearanceService.deleteById(securityClearanceId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        if (securityClearanceService.findById(securityClearanceId) == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if(Objects.equals(securityClearanceService.findById(securityClearanceId).getSecurityClearanceId(), securityClearanceId)){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
