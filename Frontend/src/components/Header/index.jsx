import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/EduNEXT.svg';
import DarkModeSwitcher from './DarkModeSwitcher';
import DropdownCoin from './DropdownCoin';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation(); // Get the current location object
  const formattedPath =
    location.pathname
      .replace('/', '') // Remove the leading "/"
      .replace(/-/g, ' ') // Optional: Replace hyphens with spaces if present
      .charAt(0)
      .toUpperCase() + location.pathname.slice(2).toLowerCase();
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle Button */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              {/* Hamburger icon */}
              {/* (your hamburger icon code remains here) */}
            </span>
          </button>
          {/* Hamburger Toggle Button */}

          {/* Responsive Logo */}
          
<Link className="block flex-shrink-0 lg:hidden" to="/">
  <img
    src={LogoIcon}
    alt="EduNext Logo"
    className="h-40 w-auto sm:h-12 md:h-14 lg:h-16" // Adjust height based on screen size
  />
</Link>

        </div>

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <input
                type="text"
                placeholder={formattedPath || 'Home'} // Display formatted path or 'Home'
                disabled
                className="w-full bg-transparent pl-9 pr-4 text-black font-bold text-2xl focus:outline-none dark:text-white xl:w-125"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />
            {/* Dark Mode Toggler */}

            <DropdownCoin/>

            {/* Notification Menu Area */}
            <DropdownNotification />

            {/* Notification Menu Area */}

            {/* Chat Notification Area */}
            <DropdownMessage />
            {/* Chat Notification Area */}
          </ul>

          {/* User Area */}
          <DropdownUser userName="Swadha" />
          {/* User Area */}
        </div>
      </div>
    </header>
  );
};

export default Header;
