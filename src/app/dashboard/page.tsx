'use client';

import Rooms from '@/components/Rooms';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  LayoutContextProvider,
} from '@livekit/components-react';
import { useEffect, useRef, useState } from 'react';
import { useMainContext } from '@/components/MainContext';
import axios from 'axios';
import { VideoPreset, VideoPresets } from 'livekit-client';
import CustomVideoConference from '@/components/CustomVideoConference';
import Account from '@/components/Account';
import type { PinState } from '@livekit/components-core';
import { AiOutlineMenu } from 'react-icons/ai';
import Drawer from '@/components/Drawer';

const Page = () => {
  const { user, chosenRoom, choosingRoom } = useMainContext();
  const [token, setToken] = useState<string>(chosenRoom || '');
  const [focusTrack, setFocusTrack] = useState<PinState>([]);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (!chosenRoom) return;
    (async () => {
      try {
        const { data } = await axios(
          `/api/auth/getParticipantToken?room=${chosenRoom}&username=${user.username}`,
        );
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenRoom]);

  return (
    <div className="h-screen max-h-screen overflow-hidden">
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
        key={token}
        onDisconnected={async () => {
          await axios.delete(`/api/participants`, {
            data: { room: chosenRoom, username: user.username },
          });
          choosingRoom('');
        }}
      >
        <LayoutContextProvider onPinChange={(state) => setFocusTrack(state)}>
          <div className="grid grid-cols-1 grid-rows-[50px_auto] sm:grid-rows-1 sm:grid-cols-[200px_auto] h-full">
            <div className="hidden sm:grid grid-rows-[auto_100px] p-2 pr-0 gap-2">
              <Rooms />
              <Account />
            </div>
            <div className="block sm:hidden rounded-md bg-[#1e1e1e] m-1 p-1">
              <div
                className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#3e3e3e] hover:bg-[#5e5e5e] text-white relative cursor-pointer"
                onClick={() => setShowDrawer((prev) => !prev)}
              >
                <AiOutlineMenu className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
              </div>
            </div>
            <div>
              {/* Your custom component with basic video conferencing functionality. */}
              <CustomVideoConference focusTrack={focusTrack[0]} />
              {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
              <RoomAudioRenderer />
            </div>
            <Drawer
              visible={showDrawer}
              className="sm:hidden grid grid-rows-[auto_150px] gap-2 px-2 pb-2"
              onClose={() => setShowDrawer((prev) => !prev)}
            >
              <Rooms />
              <Account />
            </Drawer>
          </div>
        </LayoutContextProvider>
      </LiveKitRoom>
    </div>
  );
};

export default Page;
