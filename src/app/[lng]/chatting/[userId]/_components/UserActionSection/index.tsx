'use client';

import type { DataConnection } from 'peerjs';

import { Peer } from 'peerjs';

import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { CustomBottomNav } from '@/components/atoms/CustomBottomNav';
import { COOKIES } from '@/constants/cookies';
import { PEER_PREFIX } from '@/constants/etc';
import { useCookies } from '@/hooks/useCookies';

import { SendMessageForm } from './SendMessageForm';

interface SendMessageFormValues {
  message: string;
  peerId: string;
}

export type Form = UseFormReturn<SendMessageFormValues, any, undefined>;

export const UserActionSection = () => {
  const form = useForm<SendMessageFormValues>();
  const [cookies] = useCookies([COOKIES.USER_ID]);

  const userId = cookies.USER_ID;

  const [, /**isConnected */ setIsConnected] = useState(false);
  const peerRef = useRef<Peer>(null);
  const connectionRef = useRef<DataConnection>(null);

  const setupConnection = (conn: DataConnection) => {
    conn.on('open', () => {
      setIsConnected(true);
    });

    conn.on('data', (data) => {
      console.info('message', data);
    });

    conn.on('close', () => {
      setIsConnected(false);
    });
  };

  /**
  *  // 다른 피어에 연결
  const connectToPeer = (targetPeerId: string) => {
    if (!peerRef.current) return;

    const conn = peerRef.current.connect(targetPeerId);
    connectionRef.current = conn;
    setupConnection(conn);
  };

  // 메시지 전송
  const sendMessage = (message: string) => {
    if (connectionRef.current?.open) {
      connectionRef.current.send(message);

      return true;
    }

    return false;
  };
  */

  useEffect(() => {
    if (!userId) return;

    peerRef.current = new Peer(PEER_PREFIX + userId, {
      debug: 2,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    });

    peerRef.current.on('connection', (conn) => {
      connectionRef.current = conn;
      setupConnection(conn);
    });

    // 에러 처리
    peerRef.current.on('error', (error) => {
      console.error('Peer error:', error);
      setIsConnected(false);
    });

    return () => {
      connectionRef.current?.close();
      peerRef.current?.destroy();
    };
  }, [userId]);

  return (
    <CustomBottomNav className="border-t-0 bg-slate-100 p-5">
      <SendMessageForm form={form} />
    </CustomBottomNav>
  );
};
