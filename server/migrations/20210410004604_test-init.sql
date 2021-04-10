INSERT
    INTO account
        ( id
        , username
        , password
        )
    VALUES
        ( 0
        , 'admin'
        , crypt('admin', gen_salt('bf'))
        );

INSERT
    INTO release 
        ( id
        , title
        , release_date_year
        , release_date_month
        , release_date_day
        , release_type_id
        , cover_art
        )
    VALUES 
        ( 0
        , 'Complex Playground'
        , 2015
        , 2
        , 24
        , (SELECT id FROM release_type WHERE name = 'album')
        , 'https://e.snmc.io/i/fullres/w/07868f8cceae0b3a6cbb5cc006e9823b/5602710'
        );

INSERT
    INTO track
        ( id
        , release_id
        , title
        , track_num
        , duration_ms
        )
    VALUES
        ( 0
        , 0
        , 'Welcome!'
        , 1
        , 206000
        );