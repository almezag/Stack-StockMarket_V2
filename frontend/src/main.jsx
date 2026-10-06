import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './estilos/estilos.css';
import Aplicacion from './Aplicacion.jsx';

const elementoRaiz = document.getElementById('raiz');
const raizAplicacion = createRoot(elementoRaiz);

raizAplicacion.render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Aplicacion />
    </BrowserRouter>
  </StrictMode>
);
