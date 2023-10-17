import React, { useEffect, useState } from 'react';
import { useMainContext } from './MainContext';
import { type ParticipantInfo, type TrackInfo, type Room, TrackSource } from 'livekit-server-sdk';
import { useParticipants } from '@livekit/components-react';
import axios from 'axios';
import { BiExit } from 'react-icons/bi';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';

export default function RoomItem({ room }: { room: Room }) {
  const { user, chosenRoom, choosingRoom } = useMainContext();
  // const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const [permission, setPermission] = useState<boolean>(false);
  const participants = useParticipants();

  useEffect(() => {
    (async () => {
      // const { data } = await axios.get<{ participants: ParticipantInfo[] }>(
      //   `/api/participants?room=${room.name}`,
      // );
      // setParticipants(data?.participants);
      const {
        data: { permission: myPermission },
      } = await axios.get(`api/room?room=${room.name}`);
      setPermission(myPermission);
    })();
  }, [room.name]);

  const muteParticipant = (identity: string, tracks_id: string, mute: boolean) => {
    axios.post(`/api/mute-participant`, {
      room: room.name,
      identity,
      tracks_id,
      mute,
    });
  };
  const removeParticipant = (identity: string) => {
    axios.delete(`/api/participants`, { data: { room: room.name, username: identity } });
  };

  const className =
    chosenRoom === room.name
      ? 'w-full rounded-2xl bg-blue-400 overflow-hidden cursor-pointer text-center'
      : 'w-full rounded-2xl bg-white text-black overflow-hidden cursor-pointer text-center';

  return (
    <div className={className} onClick={() => choosingRoom(room.name)}>
      <span className="flex flex-row justify-between px-4 border-b">
        <span>{room.name}</span>
        <span>
          {participants.length}
          {/* {room.maxParticipants} */}
        </span>
      </span>
      <ul>
        {participants.map(({ sid, identity, tracks }) => {
          return (
            <li key={sid} className="flex flex-row items-center gap-2 px-4 my-1">
              {user.username === identity || permission ? (
                <>
                  <span className="flex-1 text-start">{identity}</span>
                  {/* {tracks.length === 0 && <BsFillMicMuteFill />}
                  {tracks.map((track) => (
                    <div
                      key={track.sid}
                      onClick={(e) => {
                        e.stopPropagation();
                        muteParticipant(identity, track.sid, !track.isMuted);
                      }}
                    >
                      <TrackItem track={track} />
                    </div>
                  ))} */}
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
    </div>
  );
}

function TrackItem({ track }: { track: TrackInfo }) {
  switch (track.source) {
    case 1:
    case 4:
      return track.muted ? <BsFillMicMuteFill /> : <BsFillMicFill />;
    default:
      return <BsFillMicMuteFill />;
  }
}
