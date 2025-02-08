DROP DATABASE IF EXISTS trackmania_matchmaking;
CREATE DATABASE trackmania_matchmaking;

\c trackmania_matchmaking

-- Tables
DROP TABLE IF EXISTS player_performances;
DROP TABLE IF EXISTS matches_info;
DROP TABLE IF EXISTS player_names;

-- Stats for each match
CREATE TABLE matches_info(lid VARCHAR(40) PRIMARY KEY, date VARCHAR(40), map VARCHAR(2), winning_team VARCHAR(4));

-- Username to UUID
CREATE TABLE player_names(uuid VARCHAR(40) PRIMARY KEY, display_names VARCHAR(40));

-- Stats for each players performance per match
CREATE TABLE player_performances (id SERIAL PRIMARY KEY, uuid VARCHAR(40), date VARCHAR(40), lid VARCHAR(40), points INT, position INT, team VARCHAR(4), win_match BOOLEAN);

SELECT * FROM matches_info;

--, FOREIGN KEY (uuid) REFERENCES player_names(uuid)
--, FOREIGN KEY (lid) REFERENCES matches_info(lid),