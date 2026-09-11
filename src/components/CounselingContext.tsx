'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Navbar } from './layout/Navbar';
import { CounselingModal } from './CounselingModal';

interface CounselingContextType {
  openModal: (title?: string, id?: string) => void;
  closeModal: () => void;
}

const CounselingContext = createContext<CounselingContextType | undefined>(undefined);

export function CounselingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [programTitle, setProgramTitle] = useState<string | undefined>();
  const [programId, setProgramId] = useState<string | undefined>();

  const openModal = (title?: string, id?: string) => {
    setProgramTitle(title);
    setProgramId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <CounselingContext.Provider value={{ openModal, closeModal }}>
      <Navbar onOpenCounseling={() => openModal()} />
      {children}
      <CounselingModal
        isOpen={isOpen}
        onClose={closeModal}
        defaultProgramTitle={programTitle}
        defaultProgramId={programId}
      />
    </CounselingContext.Provider>
  );
}

export function useCounseling() {
  const context = useContext(CounselingContext);
  if (!context) {
    throw new Error('useCounseling must be used within a CounselingProvider');
  }
  return context;
}

