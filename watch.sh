while inotifywait -r --exclude elm-stuff -e close_write ./frontend/src ;
do
    (cd ./frontend && sh build.sh);
done


