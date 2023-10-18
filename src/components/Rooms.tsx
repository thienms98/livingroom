'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useMainContext } from './MainContext';
import RoomItem from './Room';
import { ImSpinner2 } from 'react-icons/im';
import { Room } from 'livekit-server-sdk';
import Modal from 'react-modal';

// import { io } from 'socket.io-client';

// console.log(process.env.NEXT_PUBLIC_SOCKET_SERVER);
// const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || '', {});

const Rooms = () => {
  const { chosenRoom } = useMainContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    (async () => await getRoom())();
  }, []);

  const getRoom = async () => {
    const { data } = await axios.get('/api/rooms');
    setRooms(data || []);
  };
  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const room = await axios.post('/api/rooms', { room: newRoom });
    getRoom();
    setNewRoom('');
    setModal(false);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-lg overflow-hidden">
      <div
        className="w-auto rounded-2xl py-1 bg-green-400 hover:bg-green-600 overflow-hidden cursor-pointer text-center mx-3 box-border mt-2"
        onClick={() => setModal(true)}
      >
        + New room
      </div>

      <div className="flex flex-col items-start gap-3 mt-5 px-3">
        {rooms ? (
          rooms.length > 0 && rooms.map((room) => <RoomItem key={room.sid} room={room} />)
        ) : (
          <ImSpinner2 className="animate-spin" />
        )}
      </div>
      <Modal
        isOpen={modal}
        // onAfterOpen={afterOpenModal}
        onRequestClose={() => setModal(false)}
        contentLabel="Create room"
        style={{
          content: {
            width: '50%',
            maxWidth: '300px',
            height: 'auto',
            maxHeight: '170px',
            margin: 'auto auto',
            overflow: 'hidden',
          },
          overlay: { backgroundColor: '#1e1e1e1e' },
        }}
      >
        <form onSubmit={createRoom} className="m-3">
          <h1 className="text-black">Create new room</h1>
          <input
            type="text"
            className="w-full border border-black py-1 text-black"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            autoFocus={true}
          />

          {/* strict mode allow creator to controls participants
                <label htmlFor="checkbox">Strict mode</label>
                <input type="checkbox" onChange={(e) => e.target.checked} /> */}
          <div className="flex justify-center gap-5 mt-4">
            <button
              type="button"
              className="px-3 py-1 rounded-md text-white bg-red-400 hover:bg-red-600"
              onClick={() => setModal(false)}
            >
              Cancle
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-md bg-green-400 hover:bg-green-600 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Rooms;