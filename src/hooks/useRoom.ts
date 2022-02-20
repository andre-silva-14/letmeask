import { useContext, useEffect, useState } from 'react';
import { FilterContext } from '../contexts/FilterContext';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type FirebaseQuestions = Record<
  string,
  {
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

type QuestionType = {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

function sortBy(
  a: any,
  b: any,
  prop: string,
  isBoolean: boolean = false,
  reverse: boolean = false
) {
  if (isBoolean) {
    return (!a[prop] && !b[prop]) || (a[prop] && b[prop])
      ? 0
      : a[prop]
      ? reverse
        ? 1
        : -1
      : reverse
      ? -1
      : 1;
  } else {
    return a[prop] < b[prop]
      ? reverse
        ? 1
        : -1
      : a[prop] > b[prop]
      ? reverse
        ? -1
        : 1
      : 0;
  }
}

function filterBy(
  question: QuestionType,
  property: 'content' | 'isAnswered' | 'author',
  filterValue: string | boolean
) {
  if (property === 'content' && typeof filterValue === 'string') {
    return question[property].toLowerCase().includes(filterValue.toLowerCase());
  }
  if (property === 'isAnswered' && filterValue === true) {
    return question[property] === filterValue;
  }
  if (property === 'author' && filterValue !== '') {
    return question[property].id === filterValue;
  }

  return true;
}

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const { textFilter, isAnsweredFilter, isMyQuestionFilter } =
    useContext(FilterContext);
  const [questionList, setQuestionList] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');
  const [closedOn, setClosedOn] = useState('');
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions = (databaseRoom.questions ??
        {}) as FirebaseQuestions;
      const parsedQuestions: QuestionType[] = Object.entries(
        firebaseQuestions
      ).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(
            ([key, like]) => like.authorId === user?.id
          )?.[0]
        };
      });

      const filteredQuestions = parsedQuestions
        .filter((question) =>
          textFilter !== '' ? filterBy(question, 'content', textFilter) : true
        )
        .filter((question) =>
          isAnsweredFilter === true
            ? filterBy(question, 'isAnswered', isAnsweredFilter)
            : true
        )
        .filter((question) =>
          isMyQuestionFilter === true
            ? filterBy(question, 'author', user?.id || '')
            : true
        );

      filteredQuestions
        .sort((a, b) => sortBy(a, b, 'likeCount', false, true))
        .sort((a, b) => sortBy(a, b, 'isHighlighted', true))
        .sort((a, b) => sortBy(a, b, 'isAnswered', true, true));

      setClosedOn(databaseRoom.closedOn);
      setTitle(databaseRoom.title);
      setAdminId(databaseRoom.authorId);
      setQuestionList(filteredQuestions);
    });

    return () => {
      roomRef.off('value');
    };
  }, [roomId, user?.id, textFilter, isAnsweredFilter, isMyQuestionFilter]);

  return { questionList, title, adminId, closedOn };
}
