'use client';

import Rooms from '@/components/Rooms';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  RoomName,
  LayoutContextProvider,
} from '@livekit/components-react';
import { useEffect, useRef, useState } from 'react';
import { useMainContext } from '@/components/MainContext';
import axios from 'axios';
import { Modal } from 'antd';
import { VideoPreset, VideoPresets } from 'livekit-client';
import CustomVideoConference from '@/components/CustomVideoConference';
const { useModal } = Modal;

const Page = () => {
  const { user, chosenRoom, choosingRoom } = useMainContext();
  const [token, setToken] = useState<string>(chosenRoom || '');
  const latestRoom = useRef<string>('');
  const [modal, contextHolder] = useModal();

  useEffect(() => {
    if (!chosenRoom) return;
    (async () => {
      try {
        const confirmed =
          !!latestRoom &&
          (await modal.confirm({
            title: 'Do you want to leave?',
            onCancel: () => {
              choosingRoom(latestRoom.current);
            },
          }));
        if (!confirmed) return;
        if (latestRoom.current)
          await axios.delete(`/api/participants`, {
            data: { room: latestRoom.current, username: user.username },
          });
        const { data } = await axios(
          `/api/auth/get-participant-token?room=${chosenRoom}&username=${user.username}`,
        );
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
      latestRoom.current = chosenRoom;
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenRoom]);

  return (
    <div className="h-screen max-h-screen overflow-hidden relative">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        // Use the default LiveKit theme for nice styles.
        options={{
          publishDefaults: {
            red: false,
            dtx: false,
            videoSimulcastLayers: [VideoPresets.h1080, VideoPresets.h720],
            screenShareSimulcastLayers: [VideoPresets.h1080, VideoPresets.h720],
          },
          adaptiveStream: { pixelDensity: 'screen' },
          dynacast: true,
        }}
        video={false}
        audio={true}
        // connectOptions={{ autoSubscribe: false }}
        data-lk-theme="default"
        style={{ height: '100dvh' }}
        key={latestRoom.current}
        onDisconnected={() => choosingRoom('')}
      >
        <LayoutContextProvider>
          <div className="grid grid-cols-[200px_auto] h-full">
            <Rooms />
            <div>
              <RoomName className="absolute top-2 left-[204px] z-50" />
              {/* Your custom component with basic video conferencing functionality. */}
              {/* <VideoConference /> */}
              <CustomVideoConference />
              {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
              <RoomAudioRenderer />
              {/* Controls for the user to start/stop audio, video, and screen 
        share tracks and to leave the room. */}
              {/* <ControlBar /> */}
            </div>
          </div>
        </LayoutContextProvider>
      </LiveKitRoom>
      {contextHolder}
    </div>
  );
};

export default Page;
