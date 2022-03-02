import { useEffect, useState } from 'react';
import classnames from 'classnames';
import copyImg from '../../assets/images/copy.svg';

import './styles.scss';

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  const [copied, setCopied] = useState(false);

  function copyRoomCodeToClipboard() {
    setCopied(true);
    navigator.clipboard.writeText(props.code);
  }

  useEffect(() => {
    if (!copied) return;

    const timer = setTimeout(() => setCopied(false), 1000);

    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      className={classnames('room-code', { copied })}
      onClick={copyRoomCodeToClipboard}
    >
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      {copied ? <span>Copied!</span> : <span>Room #{props.code}</span>}
    </button>
  );
}
