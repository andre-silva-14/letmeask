import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { database } from '../../../services/firebase';
import { useRoom } from '../../../hooks/useRoom';

import { Button } from '../../../components/Button';
import { RoomCode } from '../../../components/RoomCode';
import { Question } from '../../../components/Question';
import { ModalConfirmation } from '../../../components/ModalConfirmation';
import { FilterBar } from '../../../components/FilterBar';

import logoImg from '../../../assets/images/logo.svg';
import emptyQuestionsImg from '../../../assets/images/empty-questions.svg';
import { ReactComponent as DeleteImg } from '../../../assets/images/delete.svg';
import { ReactComponent as CheckImg } from '../../../assets/images/check.svg';
import { ReactComponent as AnswerImg } from '../../../assets/images/answer.svg';
import { ReactComponent as LikeIcon } from '../../../assets/images/like.svg';
import CloseIcon from '../../../assets/images/close.svg';

import '../styles.scss';
import { FilterContext } from '../../../contexts/FilterContext';
import { SideDrawer } from '../../../components/SideDrawer';
import { useWindowSize } from '../../../hooks/useWindowSize';

type RoomParams = {
  id: string;
};

export function AdminRoomView() {
  const params = useParams<RoomParams>();
  const roomId = params.id!;
  const { questionList, title } = useRoom(roomId);
  const { textFilter, isAnsweredFilter, isMyQuestionFilter } =
    useContext(FilterContext);
  const [width] = useWindowSize();

  const [closeRoomModal, setCloseRoomModal] = useState(false);
  const [deleteQuestionModal, setDeleteQuestionModal] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState('');

  const navigate = useNavigate();

  function handleCloseRoomModal(state: boolean) {
    setCloseRoomModal(state);
  }

  function handleDeleteQuestionModal(state: boolean, questionId?: string) {
    questionId ? setDeleteQuestionId(questionId) : setDeleteQuestionId('');
    setDeleteQuestionModal(state);
  }

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedOn: new Date()
    });

    navigate('/');
  }

  async function handleDeleteQuestion() {
    await database
      .ref(`rooms/${roomId}/questions/${deleteQuestionId}`)
      .remove();
    setDeleteQuestionModal(false);
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
            {width > 600 ? (
              <>
                <RoomCode code={roomId} />
                <Button
                  isOutlined
                  onClick={() => {
                    handleCloseRoomModal(true);
                  }}
                >
                  Close Room
                </Button>
              </>
            ) : (
              <SideDrawer footerLastCount={2}>
                <RoomCode code={roomId} />
                <Button
                  isOutlined
                  onClick={() => {
                    handleCloseRoomModal(true);
                  }}
                >
                  Close Room
                </Button>
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
                  <>
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
                  </>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => {
                      handleDeleteQuestionModal(true, question.id);
                    }}
                  >
                    <DeleteImg />
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
                  <p>
                    Share the room code with your audience to start answering
                    their questions!
                  </p>
                </>
              ) : (
                <h3>We couldn't find any matches...</h3>
              )}
            </div>
          </div>
        )}

        <ModalConfirmation
          ariaHideApp={false}
          isOpen={closeRoomModal}
          onRequestClose={() => {
            handleCloseRoomModal(false);
          }}
          onConfirmClose={handleCloseRoom}
          title="Close Room"
          description="Are you sure you want to close this room?"
          rejectMessage="Cancel"
          confirmMessage="Yes, close"
          displayIcon={CloseIcon}
        />
        <ModalConfirmation
          ariaHideApp={false}
          isOpen={deleteQuestionModal}
          onRequestClose={() => {
            handleDeleteQuestionModal(false);
          }}
          onConfirmClose={() => {
            handleDeleteQuestion();
          }}
          title="Delete Question"
          description="Are you sure you want to delete this question?"
          rejectMessage="Cancel"
          confirmMessage="Yes, delete"
          displayIcon={CloseIcon}
        />
      </main>
    </div>
  );
}
