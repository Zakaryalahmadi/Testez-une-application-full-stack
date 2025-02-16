-- Création d'un utilisateur de test (mot de passe: test!1234)
INSERT INTO users (email, password, first_name, last_name, admin, created_at, updated_at) 
VALUES ('yoga@studio.com', '$2a$10$Ue9UoQHxHUVg4QXmqVE3.eKyQMv7X0QFiQmJ0BGZyTbhHKCQxD/1.', 'John', 'Doe', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Création de quelques teachers
INSERT INTO teachers (first_name, last_name, created_at, updated_at) 
VALUES ('Jane', 'Smith', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Création de quelques sessions
INSERT INTO sessions (name, date, description, teacher_id, created_at, updated_at) 
VALUES ('Yoga Session', '2025-03-01 10:00:00', 'Beginner friendly yoga session', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);