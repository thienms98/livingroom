import React, { memo, useEffect, useState } from 'react';
import { DisconnectButton, TrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { BiExit } from 'react-icons/bi';
import { BsGear } from 'react-icons/bs';
import Drawer from './Drawer';
import { imageUrl } from '@/utils/constants';
import Settings from '../Settings';
import { useMainContext } from '../MainContext';

const Account = () => {
  const { profile } = useMainContext();
  const [showSetting, setShowSetting] = useState<boolean>(false);

  return (
    <div className="flex flex-col justify-center p-1 px-3 gap-1 bg-[#1e1e1e] rounded-lg overflow-hidden">
      <div className="flex flex-row items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${imageUrl}/${profile.metadata || ''}`}
          alt=""
          className="w-8 h-8 rounded-full overflow-hidden bg-[#3e3e3e] mr-2"
        />
        <span>{profile.displayName || profile.username}</span>
        <button
          className="ml-auto"
          onClick={() => setShowSetting((prev) => !prev)}
          title="settings"
        >
          <BsGear />
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

      <Drawer
        visible={showSetting}
        onClose={() => setShowSetting(false)}
        className="w-full sm:w-[50%] sm:min-w-[320px]"
      >
        <Settings />
      </Drawer>
    </div>
  );
};

export default memo(Account);
