ALTER TABLE vote DROP COLUMN topic_id;

CREATE TABLE vote_session_votes(
    vote_id bigint NOT NULL,
    vote_session_id bigint NOT NULL,
    FOREIGN KEY (vote_id) REFERENCES vote (id),
    FOREIGN KEY (vote_session_id) REFERENCES vote_session (id)
);