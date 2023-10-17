'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [metadata, setMetadata] = useState<string>('');

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      usernameRef.current?.focus();
      usernameRef.current?.setAttribute('warn', 'true');
    }
    if (!password.trim()) {
      passwordRef.current?.focus();
      passwordRef.current?.setAttribute('warn', 'true');
    }
    const { data } = await axios.post('/api/auth/register', {
      username,
      password,
      displayName,
      metadata,
    });

    if (data.success) {
      toast.success('success, redirecting to login', {
        autoClose: 2000,
      });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else toast.error('fail');
  };

  return (
    <div
      className="w-screen h-screen relative bg-no-repeat bg-cover text-[#B9BBBE]"
      style={{ backgroundImage: `url('https://i.imgur.com/iBadBFf.jpeg')` }}
    >
      <div className="w-full h-full md:min-w-[500px] md:w-[35%] md:h-[70%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#36393F] p-8 flex flex-col items-center justify-center rounded-[5px] scale-[1.15]">
        <h1 className="text-2xl text-center text-white">Create an account</h1>
        <form onSubmit={(e) => signUp(e)} className="mt-3 flex flex-col w-[70%]">
          <label htmlFor="username" className="uppercase text-sm mt-2 mb-1">
            Username <span className="pl-2 text-red-400">*</span>
          </label>
          <input
            type="text"
            className="bg-[#202225] rounded-[2px] text-base"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            ref={usernameRef}
          />
          <label htmlFor="password" className="uppercase text-sm mt-2 mb-1">
            Password <span className="pl-2 text-red-400">*</span>
          </label>
          <input
            type="password"
            className="bg-[#202225] rounded-[2px] text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordRef}
          />
          <label htmlFor="displayName" className="uppercase text-sm mt-2 mb-1">
            Display name
          </label>
          <input
            type="text"
            className="bg-[#202225] rounded-[2px] text-base"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <label htmlFor="displayName" className="uppercase text-sm mt-2 mb-1">
            Avatar url
          </label>
          <input
            type="text"
            className="bg-[#202225] rounded-[2px] text-base"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
          />
          {metadata.trim() && (
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-black/25 my-2 self-center">
              {/* eslint-disable-next-line @next/next/no-img-element*/}
              <img src={metadata} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <button
            type="submit"
            className="mt-2 bg-[#5865F2] hover:bg-[#404fed] text-white rounded-[3px] py-2"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
