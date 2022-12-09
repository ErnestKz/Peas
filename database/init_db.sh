pg_ctl init -D ./data/
pg_ctl -D ./data -l logfile -o "-k /tmp" start
createdb project -h /tmp
psql -h /tmp -d project -a -f ./project.sql
psql -h /tmp -d project -a -f ./insert_test_data.sql
