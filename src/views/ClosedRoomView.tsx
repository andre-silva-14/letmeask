import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';

import logoImg from '../assets/images/logo.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function ClosedRoomView() {
  const params = useParams<RoomParams>();
  const roomId = params.id!;
  const { title, closedOn } = useRoom(roomId);
  const [parsedClosedDate, setParsedClosedDate] = useState('');

  const navigate = useNavigate();

  function handleExitRoom() {
    navigate('/');
  }

  useEffect(() => {
    const parsedDate = new Date(closedOn).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    setParsedClosedDate(parsedDate);
  }, [closedOn, roomId]);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <Button onClick={handleExitRoom}>Exit Room</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
        </div>

        <div className="no-questions">
          <img src={emptyQuestionsImg} alt="Empty questions list" />
          <div>
            <h3>This room is already closed.</h3>
            <p>
              This session was closed on <br /> {parsedClosedDate}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
