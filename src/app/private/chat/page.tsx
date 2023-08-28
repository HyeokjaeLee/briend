'use client';

import React from 'react';

import { ChatList } from './_components/ChatList';
import { useConnectSocket } from './_hooks/useConnetSocket';

// component
const Index = () => {
  const { isConnected } = useConnectSocket();

  return isConnected ? <ChatList /> : <></>;
};

export default Index;
