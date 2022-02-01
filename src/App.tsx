import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { UserContextProvider } from './contexts/UserContext';
import { AdminRoom } from './pages/AdminRoom';
import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />

          <Route path="/admin/rooms/:id" element={<AdminRoom />} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
