CREATE DATABASE trackmania_matchmaking;

-- Tables
DROP TABLE IF EXISTS matches_info;
DROP TABLE IF EXISTS player_names;
DROP TABLE IF EXISTS player_performances;

-- Stats for each match
CREATE TABLE matches_info(lid VARCHAR(40) PRIMARY KEY, date VARCHAR(40), map VARCHAR(2), winning_team VARCHAR(4));

-- Username to UUID
CREATE TABLE player_names(uuid VARCHAR(40) PRIMARY KEY, display_names VARCHAR(40));

-- Stats for each players performance per match
CREATE TABLE player_performances (id SERIAL PRIMARY KEY, uuid VARCHAR(40), FOREIGN KEY (uuid) REFERENCES player_names(uuid), lid VARCHAR(40), FOREIGN KEY (lid) REFERENCES matches_info(lid), points INT, position INT, team VARCHAR(4), win_match BOOLEAN);
