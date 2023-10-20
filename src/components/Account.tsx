import React, { memo } from 'react';
import { useMainContext } from './MainContext';
import { DisconnectButton, TrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { BiExit } from 'react-icons/bi';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Account = () => {
  const { user } = useMainContext();
  const router = useRouter();
  const displayName = user.displayName || user.username;
  return (
    <div className="flex flex-col justify-center p-1 px-3 gap-1 bg-[#1e1e1e] rounded-lg overflow-hidden">
      <div className="flex flex-row items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.metadata || ''}
          alt=""
          className="w-8 h-8 rounded-full overflow-hidden bg-[#3e3e3e] mr-2"
        />
        <span>{displayName}</span>
        <button
          onClick={async () => {
            const { data } = await axios.post('/api/auth/logout');
            if (data) router.push('/login');
          }}
        >
          Logout
        </button>
      </div>
      <div className="w-full flex flex-row gap-1 scale-[.8] origin-top-left">
        <TrackToggle source={Track.Source.Microphone} title="micro" />
        <TrackToggle source={Track.Source.Camera} title="camera" />
        <TrackToggle source={Track.Source.ScreenShare} title="screen-share" />
        <DisconnectButton title="leave">
          <BiExit />
        </DisconnectButton>
      </div>
    </div>
  );
};

export default memo(Account);
