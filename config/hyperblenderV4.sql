-- HyperBlender SQL script
-- Version 4

DROP DATABASE IF EXISTS hyperble_main;

-- CREATE DATABASE

CREATE DATABASE IF NOT EXISTS hyperble_main DEFAULT CHARACTER SET utf8;
SET default_storage_engine=InnoDB;
USE hyperble_main;


-- TABLES
-- roles

DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (
  id tinyint(4) UNSIGNED NOT NULL,
  name varchar(20) NOT NULL,

  CONSTRAINT pk_roles_id PRIMARY KEY (id),
  CONSTRAINT un_roles_name UNIQUE KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- users

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  userId int NOT NULL AUTO_INCREMENT,
  name varchar(25) NOT NULL,
  email varchar(255) NOT NULL,
  emailVerified varchar(1) NOT NULL DEFAULT '0',
  role tinyint(4) UNSIGNED NOT NULL DEFAULT '0',
  password varchar(60) NOT NULL,
  token varchar(30) NOT NULL,
  registration datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status varchar(5) NOT NULL,
  lastConnection datetime DEFAULT NULL,
  connectionCount mediumint(8) UNSIGNED DEFAULT '0',

  CONSTRAINT pk_users_userId PRIMARY KEY (userId),
  CONSTRAINT un_users_email UNIQUE KEY (email),
  CONSTRAINT un_users_token UNIQUE KEY (token),
  CONSTRAINT fk_users_role FOREIGN KEY (role) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;

-- calendars

DROP TABLE IF EXISTS calendars;
CREATE TABLE IF NOT EXISTS calendars (
  id int NOT NULL AUTO_INCREMENT,
  userId int NOT NULL,
  alias varchar(60) DEFAULT NULL,
  color char(7) NOT NULL,
  visible tinyint(1) NOT NULL DEFAULT '1',
  importDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lastUpdate datetime DEFAULT NULL,
  url varchar(2083) DEFAULT NULL,
  content mediumtext DEFAULT NULL,

  CONSTRAINT pk_calendars_id PRIMARY KEY (id),
  CONSTRAINT fk_calendars_userId FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;

-- filters

DROP TABLE IF EXISTS filters;
CREATE TABLE IF NOT EXISTS filters (
  id int NOT NULL AUTO_INCREMENT,
  calId int NOT NULL,
  field varchar(10) NOT NULL,
  val varchar(256),
  way tinyint NOT NULL DEFAULT '0',
  created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT pk_filters_id PRIMARY KEY (id),
  CONSTRAINT fk_filters_calId FOREIGN KEY (calId) REFERENCES calendars(id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8;

-- options

DROP TABLE IF EXISTS options;
CREATE TABLE IF NOT EXISTS options (
  id int NOT NULL AUTO_INCREMENT,
  userId int NOT NULL,
  calViewFrom varchar(5),
  calViewTo varchar(5),
  calViewWE tinyint(1),
  calEnableCollisions tinyint(1),
  
  CONSTRAINT pk_options_id PRIMARY KEY (id),
  CONSTRAINT fk_options_userId FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8;

-- sqlcommands

DROP TABLE IF EXISTS sqlcommands;
CREATE TABLE IF NOT EXISTS sqlcommands (
  id int NOT NULL AUTO_INCREMENT,
  userId int NOT NULL,
  command mediumtext DEFAULT NULL,
  alias varchar(20) NOT NULL,

  CONSTRAINT pk_sqlcommands_id PRIMARY KEY (id),
  CONSTRAINT fk_sqlcommands_userId FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;

-- mailsent

DROP TABLE IF EXISTS mailsent;
CREATE TABLE IF NOT EXISTS mailsent (
  id int NOT NULL AUTO_INCREMENT,
  userId int NOT NULL,
  mailfrom varchar(255),
  mailsubject varchar(100),
  mailbcc varchar(1000),
  mailtext mediumtext,
  mailhtml mediumtext,

  CONSTRAINT pk_mailsent_id PRIMARY KEY (id),
  CONSTRAINT fk_mailsent_userId FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8;

-- INSERT
-- roles

INSERT INTO roles (id, name) VALUES
(0, 'lambda'),
(9, 'admin'),
(10, 'root');

-- users

INSERT INTO users (userId, name, email, role, password, token, status) VALUES
(1, 'root', 'a@a', 10, '$2b$10$t.pcjg/WuRZ6Ry4o6sycFudheuQUFQjcBbGovdFH1B2PlLTLCCWCq', 'OwfNOYNWttZB6iLU0WNua6XjlZ4mdv', 'root');

-- sqlcommands

INSERT INTO sqlcommands (id, userId, command, alias) VALUES
(1000, 1, 'SELECT * FROM users;', 'All users'),
(1001, 1, 'SELECT CONCAT(name, \' <\', email, \'>\') AS \'Utilisateur\', COUNT(calendars.userId) AS \'Nombre de calendriers\', connectionAmount AS \'Nombre de connexions\' FROM users LEFT JOIN calendars ON users.userId = calendars.userId GROUP BY users.userId;', 'Nbr de cal & connex');
