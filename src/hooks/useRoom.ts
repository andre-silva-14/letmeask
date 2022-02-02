import { useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type FirebaseQuestions = Record<
  string,
  {
    author: {
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

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questionList, setQuestionList] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

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

      parsedQuestions
        .sort((a, b) => sortBy(a, b, 'likeCount', false, true))
        .sort((a, b) => sortBy(a, b, 'isHighlighted', true))
        .sort((a, b) => sortBy(a, b, 'isAnswered', true, true));

      setTitle(databaseRoom.title);
      setQuestionList(parsedQuestions);
    });

    return () => {
      roomRef.off('value');
    };
  }, [roomId, user?.id]);

  return { questionList, title };
}
