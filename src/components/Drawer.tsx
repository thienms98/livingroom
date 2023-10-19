import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

type DrawerProps = {
  visible: boolean;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
};

const Drawer = (props: DrawerProps) => {
  return (
    <div
      className={`fixed top-0 left-0 ${
        props.visible ? 'block' : 'hidden'
      } w-full h-full z-[1] pt-8 bg-[#0e0e0e] ${props.className || ''}`}
    >
      <div
        className="w-6 h-6 rounded-full overflow-hidden bg-[#1e1e1e] absolute top-1 right-1 flex items-center justify-center cursor-pointer"
        onClick={() => props.onClose && props.onClose()}
      >
        <FaChevronLeft />
      </div>
      {props.children}
    </div>
  );
};

export default Drawer;
