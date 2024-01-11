CREATE TABLE meeting_topics(
    topic_id bigint NOT NULL,
    meeting_id bigint NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topic (id),
    FOREIGN KEY (meeting_id) REFERENCES meeting (id)
);