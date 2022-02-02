import { useNavigate, useParams } from 'react-router-dom';
import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg';
import { ReactComponent as DeleteImg } from '../assets/images/delete.svg';
import { ReactComponent as CheckImg } from '../assets/images/check.svg';
import { ReactComponent as AnswerImg } from '../assets/images/answer.svg';
import { ReactComponent as LikeIcon } from '../assets/images/like.svg';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id!;

  const navigate = useNavigate();
  const { questionList, title } = useRoom(roomId);

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedOn: new Date()
    });

    navigate('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Are you sure you want to remove this question?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(
    questionId: string,
    isAnswered: boolean
  ) {
    isAnswered
      ? await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isAnswered: false
        })
      : await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isAnswered: true
        });
  }

  async function handleHighlightQuestion(
    questionId: string,
    isHighlighted: boolean
  ) {
    isHighlighted
      ? await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isHighlighted: false
        })
      : await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
          isHighlighted: true
        });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleCloseRoom}>
              Close Room
            </Button>
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
                {question.likeCount > 0 && (
                  <div className="like-info">
                    <span>{question.likeCount}</span>
                    <LikeIcon />
                  </div>
                )}

                <button
                  type="button"
                  className="answered-button"
                  onClick={() =>
                    handleCheckQuestionAsAnswered(
                      question.id,
                      question.isAnswered
                    )
                  }
                >
                  <CheckImg />
                </button>
                {!question.isAnswered && (
                  <button
                    type="button"
                    className="highlight-button"
                    onClick={() =>
                      handleHighlightQuestion(
                        question.id,
                        question.isHighlighted
                      )
                    }
                  >
                    <AnswerImg />
                  </button>
                )}
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <DeleteImg />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
