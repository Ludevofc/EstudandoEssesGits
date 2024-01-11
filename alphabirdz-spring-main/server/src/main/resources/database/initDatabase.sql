DROP TABLE birds IF EXISTS;
DROP TABLE posts IF EXISTS;
DROP TABLE users IF EXISTS;

CREATE TABLE birds (
    id INTEGER IDENTITY PRIMARY KEY,
    image_url VARCHAR(255),
    english_name VARCHAR(100),
    latin_name VARCHAR(100),
    portuguese_name VARCHAR(100),
    dominant_color VARCHAR(30),
    gender VARCHAR(30),
    habitat VARCHAR(30),
    family VARCHAR(30),
    bird_size VARCHAR(30)
);

CREATE TABLE users (
    id INTEGER IDENTITY PRIMARY KEY,
    profile_photo VARCHAR(255),
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE posts (
    id INTEGER IDENTITY PRIMARY KEY,
    image VARCHAR(255),
    location VARCHAR(255),
    date VARCHAR(255),
    user_id INTEGER NOT NULL,
    bird_id INTEGER NOT NULL,
);
ALTER TABLE posts ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE posts ADD CONSTRAINT fk_bird_id FOREIGN KEY (bird_id) REFERENCES birds (id);