import { DrawerProps } from '@/utils/interfaces';
import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

const Drawer = (props: DrawerProps) => {
  return (
    <div
      className={`fixed top-0 left-0 ${
        props.visible ? 'block' : 'hidden'
      } w-screen h-screen overflow-auto z-[1] bg-[#0e0e0e88]`}
    >
      <div className="absolute w-full h-full bg-transparent" onClick={props.onClose}></div>
      <div className={`bg-[#0e0e0e] h-full relative pt-12 ${props.className || ''}`}>
        <div
          className="w-10 h-10 rounded-full overflow-hidden bg-[#1e1e1e] absolute top-1 right-3 flex items-center justify-center cursor-pointer"
          onClick={() => props.onClose && props.onClose()}
        >
          <FaChevronLeft />
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default Drawer;
