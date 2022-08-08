package learn.field_agent.data;

import learn.field_agent.models.SecurityClearance;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class SecurityClearanceJdbcTemplateRepositoryTest {

    @Autowired
    SecurityClearanceJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindById() {
        SecurityClearance secret = new SecurityClearance(1, "Secret");
        SecurityClearance topSecret = new SecurityClearance(2, "Top Secret");

        SecurityClearance actual = repository.findById(1);
        assertEquals(secret, actual);

        actual = repository.findById(2);
        assertEquals(topSecret, actual);

        actual = repository.findById(3);
        assertEquals(null, actual);
    }

    @Test
    void shouldFindAllSecurityClearances() {
        List<SecurityClearance> clearances = new ArrayList<>();
        clearances.add(new SecurityClearance(1, "Secret"));
        clearances.add(new SecurityClearance(2, "Top Secret"));

        List<SecurityClearance> actual = repository.findAll();

        assertEquals(clearances.size(), actual.size());
        assertEquals(clearances.get(1).getName(), actual.get(1).getName());

    }

    @Test
    void shouldAddSecurityClearance(){
        SecurityClearance securityClearance = new SecurityClearance();
        securityClearance.setSecurityClearanceId(3);
        securityClearance.setName("Top Top Secret");

        SecurityClearance actual = repository.add(securityClearance);


        assertNotNull(actual);
        assertEquals(securityClearance, actual);
    }

    @Test
    void shouldUpdateExisting() {
        SecurityClearance clearance = new SecurityClearance();
        clearance.setSecurityClearanceId(1);
        clearance.setName("Not Top Secret");


        assertTrue(repository.update(clearance));
        assertEquals(clearance, repository.findById(1));
    }

    @Test
    void shouldNotUpdateMissing() {
        SecurityClearance clearance = new SecurityClearance();
        clearance.setSecurityClearanceId(20000);
        clearance.setName("Missing Clearance");


        assertFalse(repository.update(clearance));
    }


    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(2));
        assertFalse(repository.deleteById(2));
    }



}