import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import loginIcon from '../assets/images/login.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

export function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  async function handleSignIn() {
    if (!user) {
      await signInWithGoogle();
    }

    navigate('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      setErrorMessage('You must provide a room code to join an existing room.');
      setHasError(true);
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      setErrorMessage(
        'Your room code is invalid. Please contact the room host.'
      );
      setHasError(true);
      return;
    } else if (roomRef.val().closedOn) {
      setErrorMessage('This room has already been closed.');
      setHasError(true);
      return;
    }

    setHasError(false);
    navigate(`rooms/${roomCode}`);
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
          <button onClick={handleSignIn}>
            <img src={googleIconImg} alt="Google Logo" />
            Create a room with Google
          </button>
          <div className="separator">or join an existing room</div>
          <form className={hasError ? 'error-form' : ''}>
            <input
              type="text"
              placeholder="Enter a room code"
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <p>{errorMessage}</p>
            <Button onClick={handleJoinRoom} type="submit">
              <img src={loginIcon} alt="Join" />
              Join a room
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
