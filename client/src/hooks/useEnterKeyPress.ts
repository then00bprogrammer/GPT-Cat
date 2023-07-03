import { useEffect, useRef } from 'react';

const useEnterKeyPress = (buttonRef: React.RefObject<HTMLButtonElement>): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Enter') {
        buttonRef.current?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [buttonRef]);
};

export default useEnterKeyPress;
