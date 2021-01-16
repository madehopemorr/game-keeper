USE game_keeper;
INSERT INTO Users (firstName, lastName, email, password, createdAt, updatedAt)
VALUES ("leia", "organa", "leia@email.com", "princess", "2021-01-01","2021-01-01");

INSERT INTO Users (firstName, lastName, email, password, createdAt, updatedAt)
VALUES ("han", "solo", "solo@email.com", "nerfherder", "2021-01-01","2021-01-01");

INSERT INTO Users (firstName, lastName, email, password,createdAt, updatedAt)
VALUES ("luke", "skywalker", "hero@email.com", "jedi", "2021-01-01","2021-01-01");

INSERT INTO Games (title, own, userId, createdAt, updatedAt)
VALUES ("Munchkin", TRUE, 1, "2021-01-01","2021-01-01");

INSERT INTO Games (title, own, userId, createdAt, updatedAt)
VALUES ("Monopoly", TRUE, 1, "2021-01-01","2021-01-01");

INSERT INTO Games (title, own, userId, createdAt, updatedAt)
VALUES ("Kingdomino", FALSE, 1, "2021-01-01","2021-01-01");

INSERT INTO Games (title, own, userId, createdAt, updatedAt)
VALUES ("Munchkin", TRUE, 2, "2021-01-01","2021-01-01");

INSERT INTO Games (title, own, userId, createdAt, updatedAt)
VALUES ("Skull", TRUE, 2, "2021-01-01","2021-01-01");

INSERT INTO Games (title, own, userId, createdAt, updatedAt)
VALUES ("Clue", FALSE, 2, "2021-01-01","2021-01-01");