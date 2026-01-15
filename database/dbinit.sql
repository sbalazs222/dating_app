DROP DATABASE IF EXISTS tinder_app_db;
-- Adatbázis létrehozása (ha még nem létezik)
CREATE DATABASE IF NOT EXISTS tinder_app_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE tinder_app_db;

-- 1. FELHASZNÁLÓK TÁBLA
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    birth_date DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    bio TEXT,
    coords POINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    SPATIAL INDEX(coords)
) ENGINE=InnoDB;

-- 3. SWIPE (Húzások) TÁBLA
CREATE TABLE swipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,   -- Aki húz
    receiver_id INT NOT NULL, -- Akit elhúztak
    type ENUM('like', 'dislike', 'superlike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_swipe (sender_id, receiver_id) -- Ne lehessen ugyanazt kétszer lájkolni
) ENGINE=InnoDB;

-- 4. MATCHES (Párosítások) TÁBLA
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_one_id INT NOT NULL,
    user_two_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_one_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_two_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MINTAADATOK FELTÖLTÉSE
INSERT INTO users (username, email, password_hash, full_name, birth_date, gender, bio, coords) VALUES
('kovacs_bela', 'bela@example.com', 'hashed_pw_1', 'Kovács Béla', '2000-05-15', 'male', 'Szeretem a kutyákat és a kódolást.', ST_GeomFromText('POINT(19.0402 47.4979)')),
('nagy_anna', 'anna@example.com', 'hashed_pw_2', 'Nagy Anna', '2002-08-22', 'female', 'Kávéfüggő és világutazó.', ST_GeomFromText('POINT(19.0597 47.4733)')),
('szabo_zoli', 'zoli@example.com', 'hashed_pw_3', 'Szabó Zoltán', '1998-12-01', 'male', 'Gitározom és túrázom.', ST_GeomFromText('POINT(19.0307 47.5316)'));


-- Egy példa Like: Béla lájkolja Annát
INSERT INTO swipes (sender_id, receiver_id, type) VALUES (1, 2, 'like');
