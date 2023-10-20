import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMainContext } from './MainContext';
import {
  type ParticipantInfo,
  type TrackInfo,
  type Room,
  TrackSource,
  type ParticipantPermission,
} from 'livekit-server-sdk';
import { useLocalParticipant, useParticipants } from '@livekit/components-react';
import axios from 'axios';
import { BiExit } from 'react-icons/bi';
import { BsFillMicFill, BsFillMicMuteFill, BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md';
import { ImSpinner9 } from 'react-icons/im';
import {
  LocalParticipant,
  LocalTrackPublication,
  Participant,
  RemoteParticipant,
  RemoteTrackPublication,
} from 'livekit-client';

export default function RoomItem({ room }: { room: Room }) {
  const { user, chosenRoom, choosingRoom } = useMainContext();
  // get permission (room's creator) to allow, remove, mute participant
  // toggle unsubscribers visible
  const [showUnsubscribers, setShowUnsubscribers] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean>(false);
  const [roomAmount, setRoomAmount] = useState<number>(0);
  // console.log(room);

  // get current room's participants (room from layout context)
  const participants = useParticipants().concat();
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    (async () => {
      const {
        data: { permission: myPermission },
      } = await axios.get(`api/room?room=${room.name}`);
      setPermission(myPermission);
    })();
  }, [room.name]);

  const updateParticipantAmount = useCallback(async () => {
    if (room.name) {
      const { data } = await axios.get(`/api/room-participants-amount?room=${room.name}`);
      setRoomAmount(data.amount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.name, participants.length]);

  useEffect(() => {
    (async () => await updateParticipantAmount())();
  }, [updateParticipantAmount]);

  const removeParticipant = async (identity: string) => {
    await axios.delete(`/api/participants`, { data: { room: room.name, username: identity } });
    await updateParticipantAmount();
  };
  const allowToSubscribe = async (identity: string) => {
    await axios.put(`/api/participants`, {
      room: room.name,
      identity,
      metadata: null,
      permissions: {
        canSubscribe: true,
        canPublish: true,
      },
    });
    await updateParticipantAmount();
  };

  const muteParticipant = (identity: string, tracks_id?: string, mute?: boolean) => {
    if (!tracks_id) return;
    axios.post(`/api/muteParticipant`, {
      room: room.name,
      identity,
      tracks_id,
      mute,
    });
  };
  const unSubscribeTrack = async (identity: string, trackSids: string[], subscribe: boolean) => {
    await axios.put('/api/trackSubscription', {
      room: room.name,
      identity,
      trackSids,
      subscribe,
    });
  };

  const subcribers = useMemo(() => {
    return [...participants].filter((participant) => participant.permissions?.canSubscribe);
  }, [participants]);
  const unsubcribers = useMemo(() => {
    return [...participants].filter((participant) => !participant.permissions?.canSubscribe);
  }, [participants]);

  const className =
    chosenRoom === room.name
      ? 'w-full rounded-2xl bg-blue-300 text-black overflow-hidden cursor-pointer text-center'
      : 'w-full rounded-2xl bg-white text-black overflow-hidden cursor-pointer text-center';

  return (
    <div className={className} onClick={() => choosingRoom(room.name)}>
      <span className="flex flex-row justify-between px-4 border-b border-black">
        <span className="text-ellipsis overflow-hidden flex-1" title={room.name}>
          {room.name}
        </span>
        <span>
          {roomAmount} / {room.maxParticipants}
        </span>
      </span>
      {room.name === chosenRoom && (
        <>
          <Subscribers
            subcribers={subcribers}
            permission={permission}
            room={room}
            muteParticipant={muteParticipant}
            removeParticipant={removeParticipant}
          />
          {permission && (
            <button className="w-[90%] mb-3 rounded-md border border-black">
              <h1 onClick={() => setShowUnsubscribers((prev) => !prev)}>
                Request list ({unsubcribers.length})
              </h1>
              {/* <ParticipantLoop participants={roomsParticipants}></ParticipantLoop> */}
              <ul className="px-2">
                {showUnsubscribers &&
                  unsubcribers.map(({ sid, identity }) => (
                    <li key={sid} className="flex">
                      <span className="flex-1 text-left text-ellipsis overflow-hidden">
                        {identity}
                      </span>
                      <button onClick={() => allowToSubscribe(identity)}>✔</button>
                      <button onClick={() => removeParticipant(identity)}>❌</button>
                    </li>
                  ))}
              </ul>
            </button>
          )}
          {localParticipant.permissions?.canSubscribe || (
            <span className="text-xs">
              Room&#39;s admin are deciding <ImSpinner9 className="animate-spin inline" />
            </span>
          )}
        </>
      )}
    </div>
  );
}

function Subscribers({
  subcribers,
  permission,
  room,
  removeParticipant,
  muteParticipant,
}: {
  subcribers: (RemoteParticipant | LocalParticipant)[];
  permission: boolean;
  room: Room;
  removeParticipant: (identity: string) => void;
  muteParticipant: (identity: string, tracks_id?: string, mute?: boolean) => void;
}) {
  const { user } = useMainContext();

  return (
    <ul>
      {subcribers.map(({ sid, identity, tracks }) => {
        const myTracks: (RemoteTrackPublication | LocalTrackPublication)[] = [];
        tracks.forEach((item) => myTracks.push(item));

        return (
          <li key={sid} className="flex flex-row items-center gap-2 px-4 my-1">
            {user.username === identity || permission ? (
              <>
                <span className="flex-1 text-start">{identity}</span>
                {myTracks.length === 0 && <BsFillMicMuteFill />}
                {myTracks.map(
                  ({ trackInfo }) =>
                    trackInfo && (
                      <div
                        key={trackInfo.sid}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (trackInfo.muted) return;
                          muteParticipant(identity, trackInfo.sid, true);
                        }}
                      >
                        <TrackItem track={trackInfo} />
                      </div>
                    ),
                )}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    removeParticipant(identity);
                  }}
                >
                  <BiExit />
                </div>
              </>
            ) : (
              <span className="flex-1 text-start">{identity}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function TrackItem({ track }: { track: TrackInfo }) {
  // UNKNOWN = 0,
  // CAMERA = 1,
  // MICROPHONE = 2,
  // SCREEN_SHARE = 3,
  // SCREEN_SHARE_AUDIO = 4,
  // UNRECOGNIZED = -1
  switch (track.source) {
    case 1: // microphone audio
      return track.muted ? <BsCameraVideoOff /> : <BsCameraVideo />;
    case 2:
      return track.muted ? <BsFillMicMuteFill /> : <BsFillMicFill />;
    case 3:
      return track.muted ? <MdOutlineStopScreenShare /> : <MdOutlineScreenShare />;
    default:
      return <BsFillMicMuteFill />;
  }
}
