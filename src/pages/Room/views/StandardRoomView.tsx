import { FormEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../../../services/firebase';
import { useRoom } from '../../../hooks/useRoom';
import { useAuth } from '../../../hooks/useAuth';

import { Button } from '../../../components/Button';
import { RoomCode } from '../../../components/RoomCode';
import { Question } from '../../../components/Question';

import logoImg from '../../../assets/images/logo.svg';
import emptyQuestionsImg from '../../../assets/images/empty-questions.svg';
import dummyAvatarImg from '../../../assets/images/avatar.png';
import { ReactComponent as LikeIcon } from '../../../assets/images/like.svg';

import '../styles.scss';
import { FilterBar } from '../../../components/FilterBar';
import { FilterContext } from '../../../contexts/FilterContext';
import { SideDrawer } from '../../../components/SideDrawer';
import { useWindowSize } from '../../../hooks/useWindowSize';

type RoomParams = {
  id: string;
};

export function StandardRoomView() {
  const params = useParams<RoomParams>();
  const roomId = params.id!;
  const { questionList, title } = useRoom(roomId);
  const { user, signInWithGoogle } = useAuth();
  const { textFilter, isAnsweredFilter, isMyQuestionFilter } =
    useContext(FilterContext);
  const [width] = useWindowSize();

  const [newQuestion, setNewQuestion] = useState('');

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
        id: user.id,
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

  async function handleSignIn() {
    await signInWithGoogle();
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            {width > 600 ? (
              <>
                <RoomCode code={roomId} />
              </>
            ) : (
              <SideDrawer footerLastCount={2}>
                <RoomCode code={roomId} />
              </SideDrawer>
            )}
          </div>
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
                To send a question,{' '}
                <button onClick={handleSignIn}>sign in</button>.
              </span>
            ) : (
              <div className="user-info">
                <img
                  src={user.avatar}
                  alt={user.name}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // Prevents looping
                    currentTarget.src = dummyAvatarImg;
                  }}
                />
                <span>{user.name}</span>
              </div>
            )}
            <Button type="submit" disabled={!user}>
              Send question
            </Button>
          </div>
        </form>

        <FilterBar />
        {questionList.length > 0 ? (
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
                    disabled={question.isAnswered || !user?.id}
                  >
                    {question.likeCount > 0 && (
                      <span>{question.likeCount}</span>
                    )}
                    <LikeIcon />
                  </button>
                </Question>
              );
            })}
          </div>
        ) : (
          <div className="no-questions">
            <img src={emptyQuestionsImg} alt="Empty questions list" />
            <div>
              {!textFilter && !isAnsweredFilter && !isMyQuestionFilter ? (
                <>
                  <h3>There are no questions yet...</h3>
                  {!user?.id ? (
                    <p>Sign in to be the first person asking a question!</p>
                  ) : (
                    <p>Be the first to ask a question!</p>
                  )}
                </>
              ) : (
                <h3>We couldn't find any matches...</h3>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
