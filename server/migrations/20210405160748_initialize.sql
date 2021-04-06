INSERT
    INTO account
        ( account_id
        , username
        , password
        , roles
        )
    VALUES
        ( 0
        , 'admin'
        , crypt('admin', gen_salt('bf'))
        , '{DEV}'
        );

INSERT
    INTO release 
        ( release_id
        , release_title
        , release_date_year
        , release_date_month
        , release_date_day
        , release_type
        , release_cover_art
        )
    VALUES 
        ( 0
        , 'Complex Playground'
        , 2015
        , 2
        , 24
        , 'ALBUM'
        , 'https://e.snmc.io/i/fullres/w/07868f8cceae0b3a6cbb5cc006e9823b/5602710'
        );

INSERT
    INTO track
        ( track_id
        , release_id
        , track_title
        , track_num
        , track_duration_ms
        )
    VALUES
        ( 0
        , 0
        , 'Welcome!'
        , 1
        , 206000
        );