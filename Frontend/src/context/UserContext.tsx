// src/UserContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface UserContextType {
  user: { name: string; email: string } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{ name: string; email: string } | null>
  >;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
