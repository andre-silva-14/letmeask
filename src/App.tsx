import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserContextProvider } from './contexts/UserContext';
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { RoomView } from './pages/RoomView';

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<RoomView />} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
