import { useEffect, useState } from 'react';
import classnames from 'classnames';
import copyImg from '../../assets/images/copy.svg';

import './styles.scss';

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code, ...props }: RoomCodeProps) {
  const [copied, setCopied] = useState(false);

  function copyRoomCodeToClipboard() {
    setCopied(true);
    navigator.clipboard.writeText(code);
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
      {...props}
    >
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      {copied ? <span>Copied!</span> : <span>Room #{code}</span>}
    </button>
  );
}
