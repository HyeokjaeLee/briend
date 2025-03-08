import { createContext, useContext } from 'react';

export const sidePanelContext = createContext({
  isSidePanel: false,
});

export const useThisSidePanel = () => {
  const thisSidePanel = useContext(sidePanelContext);

  return thisSidePanel;
};
