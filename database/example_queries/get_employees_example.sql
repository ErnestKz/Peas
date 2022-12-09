SELECT employee_id,
       firstname,
       lastname,
       dob,
       email,
       skill_level,
       skill_name,
       skill_description,
       active,
       (EXTRACT(YEAR FROM (AGE(dob)))) AS age
FROM employees_table
INNER JOIN skill_table
ON employees_table.skill_level = skill_table.skill_id
