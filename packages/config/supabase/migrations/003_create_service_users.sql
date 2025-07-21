-- Web 앱용 사용자 (읽기 중심)
CREATE USER web_user WITH PASSWORD 'web_secure_password_here';
GRANT CONNECT ON DATABASE postgres TO web_user;
GRANT USAGE ON SCHEMA public TO web_user;
GRANT SELECT, INSERT, UPDATE ON users, chat_rooms, chat_room_participants TO web_user;
GRANT SELECT ON messages TO web_user;

-- Socket 서버용 사용자 (메시지 처리)
CREATE USER socket_user WITH PASSWORD 'socket_secure_password_here';
GRANT CONNECT ON DATABASE postgres TO socket_user;
GRANT USAGE ON SCHEMA public TO socket_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO socket_user;
GRANT SELECT ON users, chat_rooms, chat_room_participants TO socket_user;

-- RLS 정책도 각 사용자별로 적용
-- (기존 RLS 정책들이 이미 있음)