insert into employees_table
       ( firstname
       , lastname
       , dob
       , email
       , skill_level
       , active)
       
       values
	( 'John'
	, 'Doe'
	, date '2001-10-13'
	, 'john@apothecary.ie'
	, (select skill_id from skill_table where skill_name='Potion Seller')
	-- proably use an actual id
	, true);
