delete from employees_table
where employee_id = (select employee_id from employees_table where firstname = 'John');
