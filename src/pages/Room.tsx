import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import emptyQuestionsImg from '../assets/images/empty-questions.svg';
import logoImg from '../assets/images/logo.svg';
import { ReactComponent as LikeIcon } from '../assets/images/like.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id!;

  const [newQuestion, setNewQuestion] = useState('');
  const { questionList, title } = useRoom(roomId);

  const { user } = useAuth();

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined
  ) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questionList.length > 0 && (
            <span>{questionList.length} question(s)</span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
            placeholder="What do you want to ask?"
          />

          <div className="form-footer">
            {!user ? (
              <span>
                To create a question, <button>sign in</button>.
              </span>
            ) : (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            )}
            <Button type="submit" disabled={!user}>
              Send question
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questionList.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                <button
                  className={`like-button ${question.likeId ? 'liked' : ''}`}
                  type="button"
                  aria-label="Mark as liked"
                  onClick={() =>
                    handleLikeQuestion(question.id, question.likeId)
                  }
                  disabled={question.isAnswered}
                >
                  {question.likeCount > 0 && <span>{question.likeCount}</span>}
                  <LikeIcon />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
