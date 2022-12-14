-- Insert some skills.
-- Insert a user.
-- Insert a bunch of employees.

insert into skill_table (skill_name, skill_description)
       values
	('Mechanic', 'This person can fix your vehicles.'),
	('Warrior', 'This person can go into battle to fight.'),
	('Potion Seller', 'This person can provide the strongest potions.');

insert into users_table (username, password)
       values
	('admin', crypt('admin', gen_salt('bf')));


-- so basically picking a skill from the list of skills
insert into employees_table
       ( firstname
       , lastname
       , dob
       , email
       , skill_level
       , active)
       
       values
	( 'John', NULL, date '2001-10-13' , 'john@apothecary.ie'
	, (select skill_id from skill_table where skill_name='Potion Seller')
	, true ),

	( 'Bob', 'Smith', date '1970-10-24' , 'boby@apothecary.ie'
	, (select skill_id from skill_table where skill_name='Potion Seller')
	, true ),

	( 'Alice', 'Lee', date '1999-3-12' , 'Alice@apothecary.ie'
	, (select skill_id from skill_table where skill_name='Potion Seller')
	, true ) ;
