'use client';

import { useEffect, useState } from 'react';

import { Modal } from '@/components/common/modal';
import { Button } from '@/components/ui/button';

interface AlertModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  loading: boolean;
  title: string;
  description: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onCloseAction: onClose,
  onConfirmAction: onConfirm,
  loading,
  title,
  description,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
