CREATE TABLE affiliated(
    id SERIAL NOT NULL PRIMARY KEY,
    name varchar(100) NOT NULL,
    document varchar(100) NOT NULL,
    canVote varchar(100) NOT NULL
);