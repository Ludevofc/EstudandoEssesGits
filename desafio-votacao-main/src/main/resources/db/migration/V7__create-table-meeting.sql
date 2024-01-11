CREATE TABLE meeting(
    id SERIAL NOT NULL PRIMARY KEY,
    start_time timestamp NOT NULL,
    end_time timestamp,
    status varchar(100) NOT NULL
);