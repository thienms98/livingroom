'use client';

import axios from 'axios';
import { type ParticipantInfo, type TrackInfo, type Room, TrackSource } from 'livekit-server-sdk';
import { useEffect, useState } from 'react';
import { useMainContext } from './MainContext';
import RoomItem from './Room';

// import { io } from 'socket.io-client';

// console.log(process.env.NEXT_PUBLIC_SOCKET_SERVER);
// const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || '', {});

const Rooms = () => {
  const { chosenRoom } = useMainContext();
  const [createForm, setCreateForm] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<string>('');

  useEffect(() => {
    (async () => await getRoom())();
  }, [chosenRoom]);

  const getRoom = async () => {
    const { data } = await axios.get('/api/rooms');
    setRooms(data || []);
  };
  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const room = await axios.post('/api/rooms', { room: newRoom });
    getRoom();
    setNewRoom('');
    setCreateForm(false);
  };

  return (
    <form onSubmit={createRoom} className="bg-[#202225]">
      {/* <div className="relative w-full h-4">
        <RiRefreshLine className="animate-spin inline-block absolute top-0 right-0" />
      </div> */}
      {createForm ? (
        <div className="w-auto h-8 flex flex-row mx-3 mt-2">
          <input
            type="text"
            className="w-[80%] bg-transparent border border-white outline-none py-1"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            autoFocus
          />
          {newRoom ? (
            <button
              type="submit"
              className="px-2 cursor-pointer text-green-400 whitespace-nowrap text-ellipsis overflow-hidden"
            >
              ✔
            </button>
          ) : (
            <button
              type="button"
              className="px-2 cursor-pointer text-red-400 "
              onClick={() => setCreateForm(false)}
            >
              ✖
            </button>
          )}
        </div>
      ) : (
        <div
          className="w-auto rounded-2xl bg-green-400 overflow-hidden cursor-pointer text-center mx-3 box-border mt-2"
          onClick={() => setCreateForm(true)}
        >
          + New room
        </div>
      )}
      <div className="flex flex-col items-start gap-3 mt-5 px-3">
        {rooms && rooms.length > 0 && rooms.map((room) => <RoomItem key={room.sid} room={room} />)}
      </div>
    </form>
  );
};

export default Rooms;
