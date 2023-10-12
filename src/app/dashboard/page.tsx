'use client';

import { useSession } from 'next-auth/react';
import React from 'react';

const DashBoard = () => {
  const session = useSession();
  console.log(session);
  return <div>DashBoard</div>;
};

export default DashBoard;
