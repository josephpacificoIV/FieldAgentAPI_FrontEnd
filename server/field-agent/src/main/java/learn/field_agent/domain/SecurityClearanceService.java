package learn.field_agent.domain;

import learn.field_agent.data.SecurityClearanceRepository;
import learn.field_agent.models.Agent;
import learn.field_agent.models.SecurityClearance;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class SecurityClearanceService {

    private final SecurityClearanceRepository securityClearanceRepository;


    public SecurityClearanceService(SecurityClearanceRepository securityClearanceRepository) {
        this.securityClearanceRepository = securityClearanceRepository;
    }

    public List<SecurityClearance> findAll() {
        return securityClearanceRepository.findAll();
    }

    public SecurityClearance findById(int securityClearanceId) {
        return securityClearanceRepository.findById(securityClearanceId);
    }

    public Result<SecurityClearance> add(SecurityClearance securityClearance) {
        Result<SecurityClearance> result = validate(securityClearance);
        if (result.getType() != ResultType.SUCCESS) {
            return result;
        }

        SecurityClearance p = securityClearanceRepository.add(securityClearance);
        result.setPayload(p);
        return result;
    }

    public Result<SecurityClearance> update(SecurityClearance clearance) {
        Result<SecurityClearance> result = validate(clearance);
        if (!result.isSuccess()) {
            return result;
        }

        if (clearance.getSecurityClearanceId() <= 0) {
            result.addMessage("Security Clearance ID must be set for `update` operation", ResultType.INVALID);
            return result;
        }

        if (!securityClearanceRepository.update(clearance)) {
            String msg = String.format("Security Clearance ID: %s, not found", clearance.getSecurityClearanceId());
            result.addMessage(msg, ResultType.NOT_FOUND);
        }

        return result;
    }

    public boolean deleteById(int securityClearanceId) {
        return securityClearanceRepository.deleteById(securityClearanceId);
    }


    private Result<SecurityClearance> validate(SecurityClearance securityClearance) {
        Result<SecurityClearance> result = new Result<>();

        if (securityClearance == null) {
            result.addMessage("Security Clearance cannot be null", ResultType.INVALID);
            return result;
        }

        if (securityClearance.getName() == null || securityClearance.getName().trim().length() == 0) {
            result.addMessage("Security Clearance name is required", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            List<SecurityClearance> clearances = securityClearanceRepository.findAll();

            for (SecurityClearance c : clearances) {
                // If an existing security clearance was found for the provided **name** values
                // add an error message if the id values don't match (i.e. they're not the same record).
                if (c.getSecurityClearanceId() != securityClearance.getSecurityClearanceId() &&
                        Objects.equals(c.getName(), securityClearance.getName())) {
                    result.addMessage("Security Clearance name must be unique.", ResultType.INVALID);
                }
            }
        }



        return result;
    }
}
