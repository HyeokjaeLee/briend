'use client';

import type { DataConnection } from 'peerjs';

import { useParams } from 'next/navigation';
import { Peer } from 'peerjs';

import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { CustomBottomNav } from '@/components';
import { COOKIES, PEER_PREFIX } from '@/constants';
import { useCookies } from '@/hooks';

import { SendMessageForm } from './SendMessageForm';

interface SendMessageFormValues {
  message: string;
  peerId: string;
}

export type Form = UseFormReturn<SendMessageFormValues, any, undefined>;

export const UserActionSection = () => {
  const form = useForm<SendMessageFormValues>();
  const params = useParams();

  const friendUserId = params.userId;

  const [cookies] = useCookies([COOKIES.USER_ID]);

  const userId = cookies.USER_ID;

  const [isConnected, setIsConnected] = useState(false);
  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);

  const setupConnection = (conn: DataConnection) => {
    connectionRef.current = conn;

    conn.on('open', () => {
      setIsConnected(true);
    });

    conn.on('data', (data) => {
      console.info('message', data);
    });

    conn.on('close', () => {
      setIsConnected(false);
      connectionRef.current = null;
    });
  };

  useEffect(() => {
    const connectToPeer = async (targetPeerId: string) => {
      if (!peerRef.current) return;

      const conn = peerRef.current.connect(targetPeerId);
      setupConnection(conn);
    };

    const initializePeerConnection = async () => {
      if (!userId || !friendUserId) return;

      const peer = new Peer(`${PEER_PREFIX}${userId}`);
      peerRef.current = peer;

      peer.on('open', async () => {
        connectToPeer(`${PEER_PREFIX}${friendUserId}`);
      });

      peer.on('connection', (conn) => {
        setupConnection(conn);
      });

      peer.on('error', (err) => {
        console.error('PeerJS error:', err);
        setIsConnected(false);
      });
    };

    initializePeerConnection();

    return () => {
      connectionRef.current?.close();
      peerRef.current?.destroy();
    };
  }, [friendUserId, userId]);

  const onSubmit = (values: SendMessageFormValues) => {
    if (!connectionRef.current) return;

    connectionRef.current.send(values.message);
    form.reset();
  };

  return (
    <CustomBottomNav className="border-t-0 bg-slate-100 p-5">
      <SendMessageForm form={form} onSubmit={onSubmit} />
    </CustomBottomNav>
  );
};
