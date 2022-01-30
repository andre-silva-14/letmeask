import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  async function handleSignIn() {
    if (!user) {
      await signInWithGoogle();
    }

    navigate('/rooms/new');
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
          <form>
            <input type="text" placeholder="Enter a room code" />
            <Button type="submit">Join a room</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
