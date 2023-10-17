'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      usernameRef.current?.focus();
      usernameRef.current?.setAttribute('warn', 'true');
    }
    if (!password) {
      passwordRef.current?.focus();
      passwordRef.current?.setAttribute('warn', 'true');
    }

    try {
      const { data } = await axios.post('/api/auth/login', {
        username,
        password,
      });
      if (data && data.success) {
        toast.success('success');
        router.push('/dashboard');
      } else toast.error('fail');
    } catch (err) {
      toast.error('fail');
    }
  };

  return (
    <div
      className="w-screen h-screen relative bg-no-repeat bg-cover text-[#B9BBBE]"
      style={{ backgroundImage: `url('https://i.imgur.com/iBadBFf.jpeg')` }}
    >
      <div className="w-full h-full md:min-w-[500px] md:w-[35%] md:h-[50%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#36393F] p-8 flex flex-col items-center justify-center rounded-[5px] scale-[1.15]">
        <h1 className="text-2xl text-center text-white">Welcome back!</h1>
        <h3 className="text-lg text-center">We&#39;re so excited to see you again!</h3>
        <form onSubmit={(e) => signIn(e)} className="mt-3 flex flex-col w-[70%]">
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
          <Link href="#" className="text-blue-400 text-xs mb-3 mt-1 hover:underline">
            Forgot your password?
          </Link>
          <button type="submit" className="bg-[#5865F2] text-white rounded-[3px] py-2">
            Log in
          </button>
          <p className="text-xs mt-3">
            Need an account?{' '}
            <Link href="/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
