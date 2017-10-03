CREATE TABLE users (
  id serial,
  username varchar(255) NOT NULL,
  password varchar(255),
  first_name varchar(255),
  last_name varchar(255),
  PRIMARY KEY (ID)
);

CREATE TABLE screams (
  id serial,
  user_id int REFERENCES users(id),
  volume double precision,
  lowFreq double precision,
  midFreq double precision,
  highFreq double precision,
  timestamp timestamp default current_timestamp,
  PRIMARY KEY (ID)
);

CREATE TABLE form (
  id serial,
  user_id int REFERENCES users(id),
  stress_level double precision,
  timestamp timestamp default current_timestamp,
  stressors varchar(255),
  PRIMARY KEY (ID)
);


CREATE TABLE averages (
 id serial,
 user_id int REFERENCES users(id),
 stress_level double precision,
 form_data varchar(255),
 PRIMARY KEY (ID)
);

CREATE TABLE user_scores (
 id serial,
 user_id int REFERENCES users(id) UNIQUE,
 score int,
 PRIMARY KEY (ID)
);
