'use client';
import { createContext, useContext, ReactNode, useState } from 'react';

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserContextProvider');
  }
  return context;
}
