import React, { createContext, useContext, useState } from 'react';

interface PathContextType {
  path: string[];
  updatePath: (newPath: string[]) => void;
}

const PathContext = createContext<PathContextType | undefined>(undefined);

const PathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string[]>([]);

  const updatePath = (newPath: string[]) => {
    setPath(newPath);
  };

  return (
    <PathContext.Provider value={{ path, updatePath }}>
      {children}
    </PathContext.Provider>
  );
};

export { PathContext, PathProvider}
