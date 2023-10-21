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
  const { profile } = useMainContext();
  const [editData, setEditData] = useState<{ displayName?: string; metadata?: string }>({});
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [bait, setBait] = useState<number>(0);
  const router = useRouter();

  const uploadImage = async (file: File) => {
    if (!supabase) return;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`avatars/${profile.username}-${Math.random() * 1000}.png`, file, {
        cacheControl: '0',
        upsert: true,
      });
    if (!data) return;
    setEditData((prev) => ({ ...prev, metadata: data?.path }));
    setBait((prev) => prev + 1);
  };

  const updateProfile = async () => {
    const { data } = await axios.put('/api/profile', {
      username: profile.username,
      data: editData,
    });
    if (data.success) {
      toast.success('update success');
      setEditData({});
    } else toast.error('update failed');
  };

  return (
    <div className="max-h-full overflow-y-auto p-4 flex flex-col gap-4">
      <div className="w-full rounded-2xl overflow-hidden p-4 py-6 bg-[#1e1e1e]">
        <div className="bg-[#2e2e2e] rounded-2xl mt-12 h-16 pl-28 p-3 flex flex-row justify-between gap-2 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${imageUrl}/${profile.metadata}`}
            alt=""
            className="absolute bottom-3 left-3 w-24 h-24 rounded-full overflow-hidden object-cover bg-[#3e3e3e]"
          />
          <span className="self-end">{profile.displayName || ''}</span>
          <button
            className="self-end shadow-lg border border-[#1e1e1e] bg-[#1e1e1e] hover:bg-[#222] px-2 rounded-lg text-sm whitespace-nowrap text-ellipsis overflow-hidden"
            onClick={() => setShowEdit((prev) => !prev)}
          >
            <span className="md:block hidden">Edit profile</span>
            <BiEditAlt className="md:hidden block" />
          </button>
        </div>
      </div>
      <form
        className={`w-full rounded-2xl overflow-hidden flex flex-col gap-3 bg-[#1e1e1e] ${
          showEdit ? 'h-auto p-4' : 'h-0 p-0'
        }`}
        onSubmit={async (e) => {
          e.preventDefault();
          await updateProfile();
        }}
      >
        <div>
          <label>Display name</label>
          <input
            className="block bg-[#0e0e0e] outline-none rounded-md px-3 mt-1"
            type="text"
            value={editData.displayName || profile.displayName}
            onChange={(e) => setEditData((prev) => ({ ...prev, displayName: e.target.value }))}
          />
        </div>
        <div>
          <label>Change avatar</label>
          <label
            htmlFor="uploadfile"
            className="py-8 rounded-2xl overflow-hidden flex flex-col gap-2 items-center bg-[#0e0e0e] mt-2 cursor-pointer"
            onDrop={async (e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              await uploadImage(file);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div>Drop image here</div>
            {editData.metadata ? (
              <div className="rounded-lg border-none mt-2 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${imageUrl}/${editData.metadata || profile.metadata}`}
                  alt={bait.toString()}
                  className="w-full h-[150px] object-contain rounded-xl overflow-hidden"
                  key={bait}
                />
                <FaRegTimesCircle
                  className="absolute -top-1 -right-1 text-red-600 bg-black rounded-full overflow-hidden"
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    setEditData((prev) => ({ ...prev, metadata: '' }));
                  }}
                />
              </div>
            ) : (
              <BsCardImage className="scale-150" />
            )}
          </label>
          <input
            type="file"
            id="uploadfile"
            hidden
            onChange={async (e) => {
              if (e.target.files) await uploadImage(e.target.files[0]);
            }}
          />

          <button
            type="submit"
            className="relative left-full translate-x-[-100%] px-5 py-1 mt-3 bg-orange-600 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>

      <div className="rounded-2xl overflow-hidden p-4 bg-[#1e1e1e]">
        <button
          className="p-1 px-4 rounded-md overflow-hidden bg-red-500 hover:bg-red-600"
          onClick={async () => {
            const { data } = await axios.post('/api/auth/logout');
            if (data) router.push('/login');
          }}
        >
          <BiLogOut className="inline-block mr-1" /> <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
