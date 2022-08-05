package learn.field_agent.data;

import learn.field_agent.models.Alias;
import learn.field_agent.models.SecurityClearance;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class AliasJdbcTemplateRepositoryTest {

    final static int NEXT_ALIAS_ID = 3;

    @Autowired
    AliasJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindAlias() {
        Alias actual = repository.findById(1);
        assertNotNull(actual);
        assertEquals(1, actual.getAliasId());
        assertEquals("Hazel C Sauven", actual.getName());
    }

    @Test
    void shouldAddNewAlias() {
        Alias alias = new Alias();
        alias.setName("Hazel C Sauven");
        alias.setPersona("Mr Mr Potato Head");
        alias.setAgentId(1);
        alias.setAliasId(3);

        Alias actual = repository.add(alias);
        assertNotNull(actual);
        assertEquals(NEXT_ALIAS_ID, actual.getAliasId());
    }


    @Test
    void shouldUpdateExistingAlias() {
        Alias alias = new Alias();
        alias.setAliasId(1);
        alias.setName("New Name");
        alias.setPersona("New Persona");
        alias.setAgentId(1);


        assertTrue(repository.update(alias));
        assertEquals(alias.getName(), repository.findById(1).getName());
    }

    @Test
    void shouldNotUpdateMissingAlias() {
        Alias alias = new Alias();
        alias.setAliasId(20);
        alias.setName("New Name");
        alias.setPersona("New Persona");
        alias.setAgentId(1);


        assertFalse(repository.update(alias));
        //assertEquals(alias.getName(), repository.findById(1).getName());
    }

    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(2));
        assertFalse(repository.deleteById(2));
    }

    @Test
    void shouldNotDeleteMissing() {
        assertFalse(repository.deleteById(200));
    }


}