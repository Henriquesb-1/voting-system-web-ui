import { BrowserRouter } from 'react-router-dom';
import RoutesControl from './Routes';
import { ToastContainer } from 'react-toastify';

import "react-toastify/ReactToastify.min.css";

export default function App() {
  return (
    <BrowserRouter>
      <RoutesControl />
      <ToastContainer />
    </BrowserRouter>
  );
}