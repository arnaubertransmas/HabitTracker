import { createRoot } from 'react-dom/client';
import Cookies from '../components/ui/Cookies';

export const showCookiesModal = (): Promise<boolean> => {
  // return a promise
  return new Promise((resolve) => {
    const modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer);
    // ReactDOM.render new syntax
    const root = createRoot(modalContainer);

    const handleAction = (accepted: boolean) => {
      // delete comp and div from DOM
      root.unmount();
      modalContainer.remove();
      resolve(accepted);
    };

    // render comp
    root.render(<Cookies onAction={handleAction} />);
  });
};
