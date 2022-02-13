import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';

import { AdminRoomView } from '../views/AdminRoomView';
import { StandardRoomView } from '../views/StandardRoomView';
import { ClosedRoomView } from '../views/ClosedRoomView';

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id!;
  const { adminId, closedOn } = useRoom(roomId);
  const { user } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    setIsAdmin(user?.id === adminId);
  }, [user, adminId, roomId]);

  useEffect(() => {
    setIsClosed(!!closedOn);
  }, [closedOn, roomId]);

  return (
    <>
      {isClosed ? (
        <ClosedRoomView />
      ) : (
        <>{isAdmin ? <AdminRoomView /> : <StandardRoomView />}</>
      )}
    </>
  );
}
