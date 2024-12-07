import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, User, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { title: 'Chatbot', path: '/chatbot' },
    { title: 'Quiz', path: '/quiz' },
    { title: 'Interview Prep', path: '/interview' },
    { title: 'Market Trends', path: '/tables' },
    { title: 'Upcoming Workshops', path: '/workshops' },
    { title: 'Counsellors Nearby', path: '/counsellors' },
    { title: 'Alumni Connect', path: '/alumni' },
  ];

  return (
    <>
      <nav className="px-4 py-3 bg-transparent font-eczar flex items-center justify-between relative ">
        <NavLink to="/" className="text-2xl font-bold text-[#f5f5dc]">
          EduNext
        </NavLink>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-[#f5f5dc]/10 rounded-full"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-[#f5f5dc]" />
              ) : (
                <Menu className="h-6 w-6 text-[#f5f5dc]" />
              )}
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-orange-500 rounded-md shadow-lg py-1 z-50">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    className="block px-4 py-2 text-sm text-[#f5f5dc] hover:bg-[#f5f5dc]/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          
          <NavLink to="/profile" className="p-2 hover:bg-[#f5f5dc]/10 rounded-full">
            <User className="h-6 w-6 text-[#f5f5dc]" />
          </NavLink>
        </div>
      </nav>
      <div className="h-[1px] bg-[#f5f5dc]/30" />
    </>
  );
};

export default Navbar;