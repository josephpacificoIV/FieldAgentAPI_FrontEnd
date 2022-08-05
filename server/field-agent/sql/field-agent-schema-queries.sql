-- setup for http testing
use field_agent_test;
set sql_safe_updates = 0;
call set_known_good_state();
set sql_safe_updates = 1;
-- 

select * 
from alias;



-- delete aa from agency_agent aa
-- left join security_clearance sc on sc.security_clearance_id = aa.security_clearance_id
-- where sc.security_clearance_id is null;

-- delete a security clearance by ID that is not used in agency_agent table
set sql_safe_updates = 0;

delete sc from security_clearance sc 
left join agency_agent aa on aa.security_clearance_id = sc.security_clearance_id 
where aa.security_clearance_id is null and sc.security_clearance_id = 1;
-- https://stackoverflow.com/questions/32809725/delete-from-sql-table-where-id-is-found-from-conditions-applied-to-another-table

set sql_safe_updates = 1;


-- DELETE 
-- FROM table2
-- WHERE  ID IN (SELECT t1.subid
--               FROM   table1 t1
--               WHERE  t1.name = 'name1') 

-- DELETE FROM security_clearance sc
-- WHERE  sc.security_clearance_id NOT IN (SELECT aa.security_clearance_id
--               FROM   agency_agent aa
--               WHERE  aa.security_clearance_id = 2 );


-- DELETE FROM agency_agent aa 
-- WHERE aa.security_clearance_id = 2;

-- DELETE FROM security_clearance sc 
-- WHERE sc.security_clearance_id = 1 NOT IN (SELECT distinct aa.security_clearance_id FROM agency_agent aa );


-- ===========================Alias
-- data

-- merging alias to agent name
-- select a.agent_id, a.first_name, a.middle_name, a.last_name, a.dob, a.height_in_inches, al.persona
-- from agent a
-- inner join alias al on al.agent_id = a.agent_id
-- where a.agent_id = 2;


select * from alias;




