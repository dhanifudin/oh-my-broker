-- User Table
DROP TABLE IF EXISTS `user`;

CREATE TABLE IF NOT EXISTS `user`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100),
  PRIMARY KEY (`id`)
) ENGINE = MyISAM;

-- Level Table
DROP TABLE IF EXISTS `level`;

CREATE TABLE IF NOT EXISTS `level`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = MyISAM;

-- Relationship Table
DROP TABLE IF EXISTS `relationship`;

CREATE TABLE IF NOT EXISTS `relationship`(
  `relation_from` INT NOT NULL,
  `relation_to` INT NOT NULL,
  `relation_level` INT NOT NULL,
  INDEX `fk_relation_from_idx` (`relation_from` ASC),
  INDEX `fk_relation_to_idx` (`relation_to` ASC),
  INDEX `fk_relation_level_idx` (`relation_level` ASC),
  CONSTRAINT `fk_relation_from`
    FOREIGN KEY (`relation_from`)
    REFERENCES `user`(`id`),
  CONSTRAINT `fk_relation_to`
    FOREIGN KEY (`relation_to`)
    REFERENCES `user`(`id`),
  CONSTRAINT `fk_relation_level`
    FOREIGN KEY (`relation_level`)
    REFERENCES `level`(`id`)
) ENGINE = MyISAM;

-- Location Table
DROP TABLE IF EXISTS `location`;

CREATE TABLE `location`(
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(20) NULL,
  `name` VARCHAR(50) NULL,
  `level_id` INT NOT NULL,
  `parent_id` INT NULL,
  `geo` GEOMETRY NOT NULL,
  `center` GEOMETRY NOT NULL,
  PRIMARY KEY (`id`),
  SPATIAL KEY `geo` (`geo`),
  SPATIAL KEY `center` (`center`),
  INDEX `fk_location_parent_idx` (`parent_id` ASC),
  INDEX `fk_location_level_idx` (`level_id` ASC),
  CONSTRAINT `fk_location_parent`
    FOREIGN KEY (`parent_id`)
    REFERENCES `location` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_location_level`
    FOREIGN KEY (`level_id`)
    REFERENCES `level` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = MyISAM;

-- Insert Data
INSERT INTO `user` (`id`, `username`, `name`) VALUES(1, 'icub', 'Dian Hanifudin Subhi');
INSERT INTO `user` (`id`, `username`, `name`) VALUES(2, 'nisa', 'Annisa Tri Hapsari');

INSERT INTO `level` (`id`, `name`) VALUES(1, 'Koordinat');
INSERT INTO `level` (`id`, `name`) VALUES(2, 'Gedung');
INSERT INTO `level` (`id`, `name`) VALUES(3, 'Zona');
INSERT INTO `level` (`id`, `name`) VALUES(4, 'Area');

INSERT INTO `relationship` (`relation_from`, `relation_to`, `relation_level`)
  VALUES(1, 2, 1);
INSERT INTO `relationship` (`relation_from`, `relation_to`, `relation_level`)
  VALUES(2, 1, 2);
