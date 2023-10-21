import axios from 'axios';
import { useEffect, useState } from 'react';
import { useMainContext } from '../MainContext';
import { BsCardImage } from 'react-icons/bs';
import { BiLogOut, BiEditAlt } from 'react-icons/bi';
import { FaRegTimesCircle } from 'react-icons/fa';
import supabase from '@/lib/supabase';
import { imageUrl } from '@/utils/constants';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Settings = () => {
  const { profile, chosenRoom } = useMainContext();
  const [editData, setEditData] = useState<{
    name: string;
    metadata?: string;
    maxParticipants?: number;
  }>({ name: '' });
  const [bait, setBait] = useState<number>(0);

  const uploadImage = async (file: File) => {
    if (!supabase) return;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`room-cover/${profile.username}-${Math.random() * 1000}.png`, file, {
        cacheControl: '0',
        upsert: true,
      });
    if (!data) return;
    setEditData((prev) => ({ ...prev, metadata: data?.path }));
    setBait((prev) => prev + 1);
  };

  return (
    !!chosenRoom && (
      <div className="max-h-full overflow-y-auto p-4 flex flex-col gap-4">
        <div className="p-4 rounded-2xl bg-[#1e1e1e] flex flex-row">
          <div className="relative top-[-50%] w-[calc(30%)] pt-[30%] bg-[#2e2e2e] rounded-full">
            <label
              className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] cursor-pointer"
              htmlFor="roomName"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {}}
            >
              <BsCardImage className="scale-150" />
            </label>
            <input type="file" hidden id="roomName" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <label htmlFor="roomName"></label>
          </form>
        </div>
      </div>
    )
  );
};

export default Settings;
