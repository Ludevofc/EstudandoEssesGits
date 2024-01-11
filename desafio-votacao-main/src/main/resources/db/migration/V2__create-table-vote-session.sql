CREATE TABLE vote_session(
    id SERIAL NOT NULL PRIMARY KEY,
    start_time timestamp NOT NULL,
    end_time timestamp,
    topic_id bigint NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topic (id)
);