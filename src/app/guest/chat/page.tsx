'use client';

import axios from 'axios';

import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const ChatPage = () => {
  const token = useSearchParams()?.get('token');

  useEffect(() => {
    if (token) {
      axios.post('/api/chatting-room/join', {
        token,
      });
    }
  }, [token]);

  return <></>;
};

export default ChatPage;
