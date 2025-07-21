-- Briend 프로젝트 초기 스키마
-- 개발환경용 깔끔한 스키마 설계

-- ===============================
-- 사용자 테이블
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    avatar_url TEXT,
    display_name TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true
);

-- 사용자 테이블 RLS 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users" 
    ON users FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own profile" 
    ON users FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON users FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- ===============================
-- 채팅방 테이블
-- ===============================
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    max_participants INTEGER DEFAULT 100,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 채팅방 RLS 정책
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public chat rooms" 
    ON chat_rooms FOR SELECT 
    USING (NOT is_private OR created_by = auth.uid());

CREATE POLICY "Users can create chat rooms" 
    ON chat_rooms FOR INSERT 
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms" 
    ON chat_rooms FOR UPDATE 
    USING (auth.uid() = created_by);

-- ===============================
-- 채팅방 참가자 테이블
-- ===============================
CREATE TABLE IF NOT EXISTS chat_room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    left_at TIMESTAMPTZ,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    is_muted BOOLEAN DEFAULT false,
    
    -- 중복 참가 방지
    UNIQUE(room_id, user_id)
);

-- 참가자 RLS 정책
ALTER TABLE chat_room_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view room members" 
    ON chat_room_participants FOR SELECT 
    USING (
        room_id IN (
            SELECT room_id FROM chat_room_participants 
            WHERE user_id = auth.uid() AND left_at IS NULL
        )
    );

CREATE POLICY "Users can join rooms" 
    ON chat_room_participants FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" 
    ON chat_room_participants FOR UPDATE 
    USING (auth.uid() = user_id);

-- ===============================
-- 메시지 테이블
-- ===============================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- 삭제된 메시지는 내용을 숨기기 위해 체크
    CHECK ((is_deleted = false) OR (content = '[삭제된 메시지]'))
);

-- 메시지 인덱스 최적화
CREATE INDEX IF NOT EXISTS idx_messages_room_created 
    ON messages(room_id, created_at DESC);
    
CREATE INDEX IF NOT EXISTS idx_messages_user 
    ON messages(user_id, created_at DESC);

-- 메시지 RLS 정책
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view room messages" 
    ON messages FOR SELECT 
    USING (
        room_id IN (
            SELECT room_id FROM chat_room_participants 
            WHERE user_id = auth.uid() AND left_at IS NULL
        )
    );

CREATE POLICY "Participants can send messages" 
    ON messages FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id AND 
        room_id IN (
            SELECT room_id FROM chat_room_participants 
            WHERE user_id = auth.uid() AND left_at IS NULL
        )
    );

CREATE POLICY "Users can edit their own messages" 
    ON messages FOR UPDATE 
    USING (auth.uid() = user_id);

-- ===============================
-- 소셜 로그인 연동 테이블
-- ===============================
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('google', 'kakao', 'naver')),
    provider_id TEXT NOT NULL,
    provider_email TEXT,
    provider_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- 같은 제공자에서 중복 계정 방지
    UNIQUE(provider, provider_id)
);

-- 소셜 계정 RLS 정책
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own social accounts" 
    ON social_accounts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own social accounts" 
    ON social_accounts FOR ALL 
    USING (auth.uid() = user_id);

-- ===============================
-- 번역 기록 테이블 (선택사항)
-- ===============================
CREATE TABLE IF NOT EXISTS translation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_language TEXT NOT NULL,
    target_language TEXT NOT NULL,
    provider TEXT DEFAULT 'deepl' CHECK (provider IN ('deepl', 'google')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 번역 기록 인덱스
CREATE INDEX IF NOT EXISTS idx_translation_message 
    ON translation_history(message_id);
    
CREATE INDEX IF NOT EXISTS idx_translation_user 
    ON translation_history(user_id, created_at DESC);

-- 번역 기록 RLS 정책
ALTER TABLE translation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own translations" 
    ON translation_history FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create translations" 
    ON translation_history FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- ===============================
-- 업데이트 함수들
-- ===============================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 트리거 생성
CREATE TRIGGER users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER chat_rooms_updated_at 
    BEFORE UPDATE ON chat_rooms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER social_accounts_updated_at 
    BEFORE UPDATE ON social_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===============================
-- 개발용 시드 데이터
-- ===============================

-- 테스트 사용자 (개발환경에서만 사용)
INSERT INTO users (id, username, email, display_name, bio) VALUES
    ('00000000-0000-0000-0000-000000000001', 'dev_user1', 'dev1@example.com', '개발자 1', '테스트 사용자 1'),
    ('00000000-0000-0000-0000-000000000002', 'dev_user2', 'dev2@example.com', '개발자 2', '테스트 사용자 2'),
    ('00000000-0000-0000-0000-000000000003', 'dev_user3', 'dev3@example.com', '개발자 3', '테스트 사용자 3')
ON CONFLICT (id) DO NOTHING;

-- 테스트 채팅방
INSERT INTO chat_rooms (id, name, description, created_by) VALUES
    ('00000000-0000-0000-0000-000000000011', '일반 채팅', '자유롭게 대화하는 공간', '00000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000012', '개발 논의', '개발 관련 논의', '00000000-0000-0000-0000-000000000001'),
    ('00000000-0000-0000-0000-000000000013', '비밀 채팅', '비공개 채팅방', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- 테스트 참가자
INSERT INTO chat_room_participants (room_id, user_id, role) VALUES
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'admin'),
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'member'),
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'member'),
    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'admin'),
    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', 'member')
ON CONFLICT (room_id, user_id) DO NOTHING;

-- 테스트 메시지
INSERT INTO messages (room_id, user_id, content, message_type) VALUES
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', '안녕하세요! 첫 번째 메시지입니다.', 'text'),
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', '안녕하세요! 반가워요.', 'text'),
    ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'Hello! Nice to meet you.', 'text'),
    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Self-hosting 마이그레이션이 완료되었습니다!', 'text'),
    ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000002', '좋네요! 이제 로컬에서 개발할 수 있겠어요.', 'text');