CREATE TABLE vote(
    id SERIAL NOT NULL PRIMARY KEY,
    vote_value varchar(100) NOT NULL,
    topic_id bigint NOT NULL,
    affiliated_id bigint NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topic (id),
    FOREIGN KEY (affiliated_id) REFERENCES affiliated (id)
);