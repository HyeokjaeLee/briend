import { z } from 'zod';

import { publicProcedure } from '@/configs/trpc/settings';
import { createClient } from '@/database/supabase/server';
import type * as JwtPayload from '@/types/jwt';
import { assert, CustomError } from '@/utils';
import { jwtAuthSecret, onlyClientRequest } from '@/utils/server';

export const joinChat = publicProcedure
  .input(
    z.object({
      inviteToken: z.string(),
      nickname: z.string().optional(),
    }),
  )
  .mutation(async ({ input: { inviteToken, nickname }, ctx }) => {
    onlyClientRequest(ctx);

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new CustomError({ code: 'UNAUTHORIZED' });
    }

    const inviteeId = user.id;
    assert(inviteeId);

    const {
      payload: { inviterId, inviteId, inviteeLanguage },
    } = await jwtAuthSecret.verify<JwtPayload.InviteToken>(inviteToken);

    // Create or get existing chat room
    let { data: chatRoom, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('name', inviteId) // Using inviteId as room name for now
      .single();

    if (roomError && roomError.code === 'PGRST116') {
      // Room doesn't exist, create it
      const { data: newRoom, error: createError } = await supabase
        .from('chat_rooms')
        .insert({
          name: inviteId,
        })
        .select()
        .single();

      if (createError) {
        throw new CustomError({ code: 'INTERNAL_SERVER_ERROR' });
      }
      
      chatRoom = newRoom;
    } else if (roomError) {
      throw new CustomError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    // Add participants to the room
    const participants = [
      { room_id: chatRoom.id, user_id: inviterId },
      { room_id: chatRoom.id, user_id: inviteeId },
    ];

    const { error: participantError } = await supabase
      .from('chat_room_participants')
      .upsert(participants, { onConflict: 'room_id,user_id' });

    if (participantError) {
      throw new CustomError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    // Update user info if nickname is provided
    if (nickname) {
      await supabase
        .from('users')
        .upsert({
          id: inviteeId,
          username: nickname,
        });
    }

    return {
      inviterId,
      roomId: chatRoom.id,
    };
  });
