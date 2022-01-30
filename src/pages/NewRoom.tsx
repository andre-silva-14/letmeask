import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';
import '../styles/newRoom.scss';
import { useAuth } from '../hooks/useAuth';

export function NewRoom() {
  const user = useAuth();

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
          <form>
            <input type="text" placeholder="Room name" />
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
