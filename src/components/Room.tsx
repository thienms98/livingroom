import React, { useEffect, useMemo, useState } from 'react';
import { useMainContext } from './MainContext';
import { type ParticipantInfo, type TrackInfo, type Room, TrackSource } from 'livekit-server-sdk';
import { ParticipantLoop, TrackLoop, useParticipants } from '@livekit/components-react';
import axios from 'axios';
import { BiExit } from 'react-icons/bi';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import {
  LocalParticipant,
  LocalTrackPublication,
  Participant,
  RemoteParticipant,
  RemoteTrackPublication,
} from 'livekit-client';

export default function RoomItem({ room }: { room: Room }) {
  const { user, chosenRoom, choosingRoom } = useMainContext();
  // const [participants, setParticipants] = useState< (RemoteParticipant | LocalParticipant)[]>([]);
  const [permission, setPermission] = useState<boolean>(false);
  const [showUnsubscribers, setShowUnsubscribers] = useState<boolean>(false);
  const participants = useParticipants().concat();

  // useEffect(() => {
  //   setParticipants(roomsParticipants.concat())
  // }, [roomsParticipants])

  useEffect(() => {
    (async () => {
      const { data } = await axios.get<{ participants: (RemoteParticipant | LocalParticipant)[] }>(
        `/api/participants?room=${room.name}`,
      );
      // setParticipants(data?.participants);
      const {
        data: { permission: myPermission },
      } = await axios.get(`api/room?room=${room.name}`);
      setPermission(myPermission);
    })();
  }, [room.name]);

  const muteParticipant = (identity: string, tracks_id?: string, mute?: boolean) => {
    if (!tracks_id) return;
    axios.post(`/api/mute_participant`, {
      room: room.name,
      identity,
      tracks_id,
      mute,
    });
  };
  const removeParticipant = (identity: string) => {
    axios.delete(`/api/participants`, { data: { room: room.name, username: identity } });
  };
  const allowToSubscribe = (identity: string) => {
    axios.put(`/api/participants`, {
      room: room.name,
      identity,
      metadata: null,
      permissions: {
        canSubscribe: true,
      },
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
          {participants.length} / {room.maxParticipants}
        </span>
      </span>
      {room.name === chosenRoom && (
        <>
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
                                muteParticipant(identity, trackInfo.sid, !trackInfo.muted);
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
          <button className="w-[90%] mb-3 rounded-md border border-black">
            <h1 onClick={() => setShowUnsubscribers((prev) => !prev)}>
              Unsubcribers ({unsubcribers.length})
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
        </>
      )}
    </div>
  );
}

function TrackItem({ track }: { track: TrackInfo }) {
  switch (track.source) {
    case 1: // microphone audio
      // case 4: // (screen-share audio)
      return track.muted ? <BsFillMicMuteFill /> : <BsFillMicFill />;
    default:
      return <BsFillMicMuteFill />;
  }
}
