import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRoom } from '../../hooks/useRoom';
import { useAuth } from '../../hooks/useAuth';

import { AdminRoomView } from './views/AdminRoomView';
import { StandardRoomView } from './views/StandardRoomView';
import { ClosedRoomView } from './views/ClosedRoomView';
import { Loader } from '../../components/Loader';

import logoImg from '../../assets/images/logo.svg';

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id!;
  const { adminId, closedOn } = useRoom(roomId);
  const { user, isCompleted } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    setIsAdmin(user?.id === adminId);
  }, [user, adminId, roomId]);

  useEffect(() => {
    setIsClosed(!!closedOn);
  }, [closedOn, roomId]);

  useEffect(() => {
    if (adminId && isCompleted) {
      setIsLoading(false);
    }
  }, [isCompleted, adminId]);

  return (
    <>
      {isLoading ? (
        <div id="page-room">
          <header>
            <div className="content">
              <img src={logoImg} alt="letmeask" />
              <></>
            </div>
          </header>

          <main>
            <Loader />
          </main>
        </div>
      ) : (
        <>
          {isClosed ? (
            <ClosedRoomView />
          ) : (
            <>{isAdmin ? <AdminRoomView /> : <StandardRoomView />}</>
          )}
        </>
      )}
    </>
  );
}
