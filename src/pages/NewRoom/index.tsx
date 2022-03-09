import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { database } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

import { Button } from '../../components/Button';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';

import '../Home/styles.scss';
import './styles.scss';

export function NewRoom() {
  const [newRoom, setNewRoom] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  async function generateRoomCode(): Promise<string> {
    const asciiMap = Array.from({ length: 90 - 65 + 1 }, (_, i) => 65 + i);

    const roomCode =
      String.fromCharCode(
        asciiMap[Math.floor(Math.random() * asciiMap.length)]
      ) +
      String.fromCharCode(
        asciiMap[Math.floor(Math.random() * asciiMap.length)]
      ) +
      Math.random().toString().slice(2, 8);

    if ((await database.ref(`rooms/${roomCode}`).get()).exists()) {
      return generateRoomCode();
    }

    return roomCode;
  }

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    const roomCode = await generateRoomCode();

    const roomRef = database.ref('rooms');

    await roomRef.child(roomCode).set({
      title: newRoom,
      authorId: user?.id
    });

    navigate(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Illustration of questions and answers"
        />
        <strong>Every question has an answer.</strong>
        <p>Answer your audience's questions in a real-time Q&amp;A Session.</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="letmeask" />
          <h2>Create a new room</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Room name"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Create room</Button>
          </form>
          <p>
            Do you want to join an existing room instead?{' '}
            <Link to="/">Click here</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
