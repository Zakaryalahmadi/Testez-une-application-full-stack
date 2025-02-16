-- password = 123456
INSERT INTO USERS (email, password, first_name, last_name, admin, created_at, updated_at)
VALUES ('yoga@studio.com', '$2a$12$GMpMwtRAhuFeMXTSwz7QKOqOy0cEFS/NFrRNA3fgd7AI0tNmT3sOO', 'John', 'Doe', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO TEACHERS (last_name, first_name, created_at, updated_at)
VALUES ('Smith', 'Jane', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sessions
INSERT INTO SESSIONS (name, date, description, teacher_id, created_at, updated_at)
VALUES ('Yoga Session', '2025-03-01', 'Beginner friendly yoga session', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Participate (User registration to session)
INSERT INTO PARTICIPATE (session_id, user_id)
VALUES (1, 1);