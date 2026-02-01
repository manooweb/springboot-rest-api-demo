export interface ConfirmDialogData {
  titleKey: string;
  titleParams?: Record<string, unknown>;
  messageKey: string;
  messageParams?: Record<string, unknown>;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
}
