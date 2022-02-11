import { ReactNode } from 'react';
import Modal from 'react-modal';
import { Button } from '../Button';

import './styles.scss';

type ModalConfirmationProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirmClose: () => void;
  title?: string;
  description?: string;
  confirmMessage?: string;
  rejectMessage?: string;
  displayIcon?: string;
  style?: {};
  children?: ReactNode;
};

export function ModalConfirmation(props: ModalConfirmationProps) {
  return (
    <Modal
      className="modal"
      overlayClassName="overlay"
      contentLabel={props.title}
      {...props}
    >
      <img
        src={props.displayIcon}
        alt="Modal Icon"
        style={{ maxHeight: '48px' }}
      />
      <h1>{props.title}</h1>
      <p>{props.description}</p>
      <div>
        <Button onClick={props.onRequestClose}>{props.rejectMessage}</Button>
        <Button onClick={props.onConfirmClose}>{props.confirmMessage}</Button>
      </div>
      {props.children}
    </Modal>
  );
}
