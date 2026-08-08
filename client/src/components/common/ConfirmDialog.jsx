import { useEffect, useRef } from 'react';
import Button from './Button.jsx';

/**
 * Small confirmation modal for actions worth pausing on. Uses a native
 * <dialog> so focus trapping, Escape-to-close and the backdrop come from the
 * platform rather than being reimplemented.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Fires for Escape as well as close(), so cancelling stays in sync.
    const handleClose = () => onCancel?.();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onCancel]);

  return (
    <dialog
      ref={ref}
      onClick={(e) => { if (e.target === ref.current) onCancel?.(); }}
      // m-auto: Tailwind's reset clears the auto margins a native <dialog>
      // relies on to centre itself, leaving it pinned to the top-left.
      className="m-auto w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 p-0 shadow-2xl backdrop:bg-navy-950/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <h2 className="text-base font-bold text-navy-900">{title}</h2>
        {message && <p className="mt-1.5 text-sm text-slate-600">{message}</p>}

        <div className="mt-5 flex gap-2.5">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="gold" className="flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
