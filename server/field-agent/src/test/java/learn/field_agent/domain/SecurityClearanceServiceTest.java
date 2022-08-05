package learn.field_agent.domain;

import learn.field_agent.data.AgencyRepository;
import learn.field_agent.data.SecurityClearanceRepository;
import learn.field_agent.models.Agency;
import learn.field_agent.models.SecurityClearance;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class SecurityClearanceServiceTest {

    @Autowired
    SecurityClearanceService securityClearanceService;

    @MockBean
    SecurityClearanceRepository securityClearanceRepository;

    @Test
    void shouldFindAllSecurityClearances() {

    }

    @Test
    void findById() {
    }

    @Test
    void shouldAddNewSecurityClearance() {

        SecurityClearance clearance = new SecurityClearance(0, "Security Clearance Test");
        SecurityClearance mockOut = new SecurityClearance(5, "Security Clearance Test");

        when(securityClearanceRepository.add(clearance)).thenReturn(mockOut);

        Result<SecurityClearance> result = securityClearanceService.add(clearance);
        assertEquals(ResultType.SUCCESS, result.getType());
        assertEquals(mockOut, result.getPayload());
    }

    @Test
    void shouldNotAddSecurityClearanceWithoutName() {
        Result<SecurityClearance> result = securityClearanceService.add(
                new SecurityClearance(0, ""));

        assertEquals(ResultType.INVALID, result.getType());
        assertNull(result.getPayload());


    }

    @Test
    void shouldNotAddDuplicateSecurityClearance() {

        List<SecurityClearance> clearances = List.of(
                new SecurityClearance(1, "Top Secret"),
                new SecurityClearance(2, "Secret")
        );

        SecurityClearance dup_clearance = new SecurityClearance(3, "Top Secret");
        when(securityClearanceRepository.findAll()).thenReturn(clearances);

        Result<SecurityClearance> result = securityClearanceService.add(dup_clearance);

        // 6. Configure the per-test behavior for mock PetRepository.

        assertEquals(ResultType.INVALID, result.getType());
        assertNull(result.getPayload());


    }

    @Test
    void shouldUpdate() {
        SecurityClearance clearance = new SecurityClearance(2, "Back to Top Secret");

        when(securityClearanceRepository.update(clearance)).thenReturn(true);
        Result<SecurityClearance> actual = securityClearanceService.update(clearance);
        assertEquals(ResultType.SUCCESS, actual.getType());
    }

    @Test
    void shouldNotUpdateMissing() {
        SecurityClearance clearance = new SecurityClearance(35, "TEST");

        when(securityClearanceRepository.update(clearance)).thenReturn(false);
        Result<SecurityClearance> actual = securityClearanceService.update(clearance);
        assertEquals(ResultType.NOT_FOUND, actual.getType());
    }

    @Test
    void shouldNotUpdateWhenInvalid() {
        SecurityClearance clearance = new SecurityClearance(35, null);

        Result<SecurityClearance> actual = securityClearanceService.update(clearance);
        assertEquals(ResultType.INVALID, actual.getType());

        clearance.setName("  ");
        actual = securityClearanceService.update(clearance);
        assertEquals(ResultType.INVALID, actual.getType());

    }


    /* Delete Tests */
    @Test
    void shouldNotDeleteMissingSecurityClearance() {
        when(securityClearanceRepository.deleteById(10)).thenReturn(false);
        assertFalse(securityClearanceService.deleteById(10));
    }

    @Test
    void shouldDelete() {
        when(securityClearanceRepository.deleteById(1)).thenReturn(true);
        assertTrue(securityClearanceService.deleteById(1));
    }

}