CREATE TABLE vote_affiliated(
    vote_id bigint NOT NULL,
    affiliated_id bigint NOT NULL,
    FOREIGN KEY (vote_id) REFERENCES vote (id),
    FOREIGN KEY (affiliated_id) REFERENCES affiliated (id)
);