CREATE TABLE IF NOT EXISTS account
(
    id          BIGINT  GENERATED ALWAYS AS IDENTITY,
    username    TEXT    NOT NULL UNIQUE,
    password    TEXT    NOT NULL
);