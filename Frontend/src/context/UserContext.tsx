import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/signin'); // Redirect to /signin on error
        return;
      }

      try {
        const response = await fetch(
          'http://localhost:5050/api/users/profile',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Attach the token to the request
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();
        setUser(userData.data); // Set the user in the context state
        localStorage.setItem('user', JSON.stringify(userData.data)); // Save user object to local storage
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/auth/signin'); // Redirect to /signin on error
      }
    };

    fetchUserProfile();
  }, [navigate]); // Include navigate in dependency array

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
