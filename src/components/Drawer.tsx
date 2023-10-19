import React from 'react';

type DrawerProps = {
  children?: React.ReactNode;
};

const Drawer = (props: DrawerProps) => {
  return <div className="fixed top-0 left-0 w-full bg-white z-50">{props.children}</div>;
};

export default Drawer;
