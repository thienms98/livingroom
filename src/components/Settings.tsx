import { useState } from 'react';
import AccountSetting from './setting-components/AccountSetting';
import RoomSetting from './setting-components/RoomSetting';

const Settings = () => {
  const [tab, setTab] = useState<number>(1);
  const tabs = [
    // {
    //   key: 0,
    //   title: 'Room',
    //   component: <RoomSetting />,
    // },
    {
      key: 1,
      title: 'Account',
      component: <AccountSetting />,
    },
  ];

  return (
    <div>
      <div className="absolute top-4 left-4 flex flex-row gap-2 max-w-[calc(100%_-_100px)] overflow-x-auto">
        {tabs.map(({ key, title }) => (
          <button
            key={key}
            className={`p-1 px-3 rounded-lg ${
              key === tab ? 'bg-[#5e5e5e]' : 'bg-[#1e1e1e] hover:bg-[#3e3e3e]'
            }`}
            onClick={() => setTab(key)}
          >
            {title}
          </button>
        ))}
      </div>
      {tabs.find(({ key }) => key === tab)?.component}
    </div>
  );
};

export default Settings;
