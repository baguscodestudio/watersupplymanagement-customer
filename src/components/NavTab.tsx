import { Menu } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';

import DropDownLinkType from '../type/DropDownLink';

// Icons
import { Home, UserCircle } from 'styled-icons/heroicons-outline';
import { BarGraph } from '@styled-icons/entypo/BarGraph';
import { BellFill, CreditCard, CircleFill } from 'styled-icons/bootstrap';
import { ClipboardList } from '@styled-icons/fa-solid/ClipboardList';
import { RestartAlt } from '@styled-icons/material-outlined/RestartAlt';
import { PageEdit } from '@styled-icons/foundation/PageEdit';

const Links = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: <Home size="24" />,
  },
  {
    name: 'My Account',
    icon: <UserCircle size="24" />,
    sublinks: [
      {
        path: '/account/password',
        name: 'Update Password',
        icon: <UserCircle size="24" />,
      },
    ],
  },
  {
    name: 'Water usage',
    icon: <BarGraph size="24" />,
    sublinks: [
      {
        path: '/waterusage/current',
        name: 'Current Water Usage',
        icon: <CircleFill size="24" />,
      },
      {
        path: '/waterusage/past',
        name: 'Past Water Usage',
        icon: <RestartAlt size="24" />,
      },
    ],
  },
  {
    name: 'Bills',
    icon: <CreditCard size="24" />,
    sublinks: [
      {
        path: '/bill',
        name: 'View Payment',
        icon: <CircleFill size="24" />,
      },
      {
        path: '/bill/pay',
        name: 'Pay bill',
        icon: <CreditCard size="24" />,
      },
    ],
  },
  {
    name: 'Report',
    icon: <ClipboardList size="24" />,
    sublinks: [
      {
        path: '/report',
        name: 'View report',
        icon: <CircleFill size="24" />,
      },
      {
        path: '/report/create',
        name: 'Create Report',
        icon: <PageEdit size="24" />,
      },
    ],
  },
  {
    name: 'Alerts',
    icon: <BellFill size="24" />,
    sublinks: [
      {
        path: '/alerts',
        name: 'View alert',
        icon: <CircleFill size="24" />,
      },
    ],
  },
];

const DropDownLink = (data: DropDownLinkType) => {
  const location = useLocation();

  const checkSublink = () => {
    for (let i = 0; i < data.sublinks.length; i++) {
      if (data.sublinks[i].path === location.pathname) {
        return true;
      }
    }
    return false;
  };

  return (
    <Menu as="div" className="border-b-2 border-black text-lg flex flex-col">
      <Menu.Button className="w-full text-left px-4 py-2">
        {data.icon} {data.name}
      </Menu.Button>
      <Menu.Items static={checkSublink()}>
        {data.sublinks.map((link, index) => (
          <Menu.Item
            key={index}
            as="div"
            className={`border-t-2 border-black px-4 py-2 text-base bg-gray-50 ${
              location.pathname === link.path && 'font-bold'
            }`}
          >
            <Link to={link.path}>
              {link.icon} {link.name}
            </Link>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

const NavTab = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col w-1/5 border-r-2 border-black h-full">
      {Links.map((item, index) => {
        if (item.sublinks) {
          return <DropDownLink key={index} {...item} />;
        } else {
          return (
            <Link
              key={index}
              to={item.path}
              className={`border-b-2 border-black px-4 py-2 text-lg ${
                location.pathname === item.path && 'font-bold'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          );
        }
      })}
    </div>
  );
};

export default NavTab;
