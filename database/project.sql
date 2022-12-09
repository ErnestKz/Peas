CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users_table (
       user_id uuid
       	       NOT NULL
	       PRIMARY KEY
	       DEFAULT uuid_generate_v4(),
	       
       username VARCHAR(64)
       		NOT NULL,
		
       password text
       		NOT NULL
       -- will use crypt to encrypt a string and store it as bytes.
);

CREATE TABLE IF NOT EXISTS skill_table (
       skill_id uuid
       	       NOT NULL
	       PRIMARY KEY
	       DEFAULT uuid_generate_v4(),
	       
       skill_name VARCHAR(512) NOT NULL ,
       skill_description VARCHAR
);

CREATE TABLE IF NOT EXISTS employees_table (
       employee_id uuid
       	       NOT NULL
	       PRIMARY KEY
	       DEFAULT uuid_generate_v4(),
	       
       firstname VARCHAR(256),
       lastname VARCHAR(256),
       dob DATE,
       email VARCHAR(512),
       skill_level uuid
       		   REFERENCES skill_table(skill_id),
       active BOOLEAN
);

CREATE OR REPLACE VIEW employees_age AS
SELECT employee_id, (EXTRACT(YEAR FROM (AGE(dob)))) AS age
FROM employees_table
