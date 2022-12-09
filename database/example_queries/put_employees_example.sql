insert into employees_table
       ( employee_id
       , firstname
       , lastname
       , dob
       , email
       , skill_level
       , active)
       
       values
	( (select employee_id from employees_table where firstname = 'John')
	, 'John'
	, 'Doeee'
	, date '2001-10-13'
	, 'john@apothecary.ie'
	, (select skill_id from skill_table where skill_name='Potion Seller')
	, true)
	
ON CONFLICT (employee_id) DO UPDATE
   SET firstname = excluded.firstname,
       lastname = excluded.lastname,
       dob = excluded.dob,
       email = excluded.email,
       skill_level = excluded.skill_level,
       active = excluded.active;
