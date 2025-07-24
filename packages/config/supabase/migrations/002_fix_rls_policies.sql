-- RLS 정책 무한 재귀 문제 수정

-- 기존 문제가 있는 정책 제거
DROP POLICY IF EXISTS "Participants can view room members" ON chat_room_participants;

-- 더 안전한 정책으로 대체
CREATE POLICY "Participants can view room members" 
    ON chat_room_participants FOR SELECT 
    USING (
        -- 본인이 참가한 방의 멤버들만 볼 수 있음
        EXISTS (
            SELECT 1 FROM chat_room_participants crp2 
            WHERE crp2.user_id = auth.uid() 
            AND crp2.room_id = chat_room_participants.room_id
            AND crp2.left_at IS NULL
        )
    );

-- 메시지 정책도 더 간단하게 수정
DROP POLICY IF EXISTS "Participants can view room messages" ON messages;
DROP POLICY IF EXISTS "Participants can send messages" ON messages;

CREATE POLICY "Participants can view room messages" 
    ON messages FOR SELECT 
    USING (
        -- 본인이 참가한 방의 메시지만 볼 수 있음
        EXISTS (
            SELECT 1 FROM chat_room_participants crp 
            WHERE crp.user_id = auth.uid() 
            AND crp.room_id = messages.room_id
            AND crp.left_at IS NULL
        )
    );

CREATE POLICY "Participants can send messages" 
    ON messages FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM chat_room_participants crp 
            WHERE crp.user_id = auth.uid() 
            AND crp.room_id = messages.room_id
            AND crp.left_at IS NULL
        )
    );