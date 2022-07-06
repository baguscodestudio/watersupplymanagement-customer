import { Home, UserCircle } from 'styled-icons/heroicons-outline';
import { BarGraph } from '@styled-icons/entypo/BarGraph';
import { Bell, Clipboard, CreditCard } from 'styled-icons/bootstrap';

const NavTab = () => {
  return (
    <div className="flex flex-col w-1/5 border-r-2 border-black h-full">
      <div className="border-b-2 border-black px-4 py-2 text-lg">
        <Home size="24" /> Dashboard
      </div>
      <div className="border-b-2 border-black px-4 py-2 text-lg">
        <UserCircle size="24" /> My Account
      </div>
      <div className="border-b-2 border-black px-4 py-2 text-lg">
        <BarGraph size="24" /> Water Usage
      </div>
      <div className="border-b-2 border-black px-4 py-2 text-lg">
        <CreditCard size="24" /> Bills
      </div>
      <div className="border-b-2 border-black px-4 py-2 text-lg">
        <Clipboard size="24" /> Report
      </div>
      <div className="border-b-2 border-black px-4 py-2 text-lg">
        <Bell size="24" /> Alerts
      </div>
    </div>
  );
};

export default NavTab;
