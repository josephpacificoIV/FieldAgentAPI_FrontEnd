package learn.field_agent.domain;

import learn.field_agent.data.AliasRepository;
import learn.field_agent.models.Agency;
import learn.field_agent.models.Alias;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class AliasServiceTest {

    @Autowired
    AliasService service;

    @MockBean
    AliasRepository repository;

    @Test
    void shouldFindById() {
        Alias expected = new Alias();
        expected.setAliasId(1);
        expected.setName("Hazel C Sauven");
        expected.setPersona("Mr. Potato");
        expected.setAgentId(1);

        when(repository.findById(1)).thenReturn(expected);
        Alias actual = service.findById(1);
        assertEquals(expected, actual);
    }

    @Test
    void shouldNotAddAliasWithoutPersonaIfAgentAlreadyHasAlias() {

        List<Alias> aliases = List.of(
                new Alias(1, "Agent Name", "Mrs. Puff", 1),
                new Alias(2, "Agent 2", "Mr. Krabs", 2)
        );

        Alias alias = new Alias(1, "Agent Name", "", 1);
        when(repository.findById(alias.getAgentId())).thenReturn(aliases.get(1));

        Result<Alias> result = service.add(alias);

        // 6. Configure the per-test behavior for mock PetRepository.

        assertEquals(ResultType.INVALID, result.getType());
        assertNull(result.getPayload());

    }

    @Test
    void shouldAddAliasWithoutPersonaIfAgentDoesNotHaveAlias() {

        List<Alias> aliases = List.of(
                new Alias(1, "Agent Name", "Mrs. Puff", 1),
                new Alias(2, "Agent 2", "Mr. Krabs", 2)
        );

        Alias alias = new Alias();
        alias.setName("Agent 3");
        alias.setPersona("");
        alias.setAgentId(3);

        when(repository.findById(alias.getAgentId())).thenReturn(null);

        Result<Alias> result = service.add(alias);

        // 6. Configure the per-test behavior for mock PetRepository.

        assertEquals(ResultType.SUCCESS, result.getType());
        assertNull(result.getPayload());

    }

    @Test
    void shouldNotAddIfNameIsMissing() {

        List<Alias> aliases = List.of(
                new Alias(1, "Agent Name", "Mrs. Puff", 1),
                new Alias(2, "Agent 2", "Mr. Krabs", 2)
        );

        Alias alias = new Alias(3, "", "Agent Persona", 1);
        when(repository.findById(alias.getAgentId())).thenReturn(aliases.get(1));

        Result<Alias> result = service.add(alias);

        // 6. Configure the per-test behavior for mock PetRepository.

        assertEquals(ResultType.INVALID, result.getType());
        assertNull(result.getPayload());

    }

    @Test
    void shouldAddAliasWithPersonaIfAgentAlreadyHasAlias() {

        List<Alias> aliases = List.of(
                new Alias(1, "Agent Name", "Mrs. Puff", 1),
                new Alias(2, "Agent 2", "Mr. Krabs", 2)
        );

        Alias alias = new Alias();
        alias.setName("Agent Name");
        alias.setPersona("new persona");
        alias.setAgentId(1);
        when(repository.findById(alias.getAgentId())).thenReturn(aliases.get(1));

        Result<Alias> result = service.add(alias);

        // 6. Configure the per-test behavior for mock PetRepository.

        assertEquals(ResultType.SUCCESS, result.getType());
        assertNull(result.getPayload());

    }


    @Test
    void shouldUpdate() {

        List<Alias> aliases = List.of(
                new Alias(1, "Agent Name", "Mrs. Puff", 1),
                new Alias(2, "Agent 2", "Mr. Krabs", 2)
        );
        Alias alias = new Alias(1, "Mrs. Krabs", "TEST", 2);

        when(repository.update(alias)).thenReturn(true);
        Result<Alias> actual = service.update(alias);
        assertEquals(ResultType.SUCCESS, actual.getType());
    }

    /* Delete Tests */
    @Test
    void shouldNotDeleteMissingAlias() {
        when(repository.deleteById(10)).thenReturn(false);
        assertFalse(service.deleteById(10));
    }

    @Test
    void shouldDelete() {
        when(repository.deleteById(1)).thenReturn(true);
        assertTrue(service.deleteById(1));
    }




}