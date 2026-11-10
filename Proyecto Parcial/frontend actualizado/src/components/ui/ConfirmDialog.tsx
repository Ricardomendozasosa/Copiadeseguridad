interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    error?: string;
    confirmando?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
                                  open,
                                  title,
                                  message,
                                  error,
                                  confirmando,
                                  onConfirm,
                                  onCancel,
                              }: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-box" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title">
                <h3 id="dialog-title">{title}</h3>
                <p>{message}</p>
                {error && <div className="field-error">{error}</div>}
                <div className="form-actions">
                    <button className="btn btn--secondary" type="button" onClick={onCancel} disabled={confirmando}>
                        Cancelar
                    </button>
                    <button className="btn btn--danger" type="button" onClick={onConfirm} disabled={confirmando}>
                        {confirmando ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
}