import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ========================================
// UI
//
// The one modal and the one toast the
// design uses, shared by every page.
// ========================================

type UiContextValue = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  toast: (message: string) => void;
};

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const toastTimerRef = useRef<number | undefined>(undefined);

  const modalOpenRef = useRef(false);

  const openModal = useCallback((content: ReactNode) => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    modalOpenRef.current = true;
    setModalContent(content);
    setModalOpen(true);
  }, []);

  // Focus goes back to whatever opened it.
  const closeModal = useCallback(() => {
    if (!modalOpenRef.current) return;
    modalOpenRef.current = false;
    setModalOpen(false);
    lastFocusRef.current?.focus?.();
  }, []);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), 2200);
  }, []);

  // Body scroll lock and focus, as in
  // the design's openModal().
  useEffect(() => {
    document.body.classList.toggle("modal-open", modalOpen);

    if (modalOpen) {
      closeButtonRef.current?.focus();
    }
  }, [modalOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, [closeModal]);

  const value = useMemo(() => ({ openModal, closeModal, toast }), [openModal, closeModal, toast]);

  return (
    <UiContext.Provider value={value}>
      {children}

      <div
        className={`modal${modalOpen ? " open" : ""}`}
        id="modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <div className="modal-box">
          <button ref={closeButtonRef} className="x" aria-label="Close" onClick={closeModal}>
            ×
          </button>
          <div id="modalBody">{modalContent}</div>
        </div>
      </div>

      <div className={`toast${toastVisible ? " show" : ""}`} id="toast" role="status">
        {toastMessage}
      </div>
    </UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const value = useContext(UiContext);

  if (!value) {
    throw new Error("useUi must be used inside UiProvider");
  }

  return value;
}
