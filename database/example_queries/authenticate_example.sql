select exists (
       select (password = crypt('t3dDy543', password)) as pswmatch
       from users_table
       where username='Mr. Bean'
       );

