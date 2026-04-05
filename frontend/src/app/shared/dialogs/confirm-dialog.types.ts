import { UiTextParams } from '../i18n/ui-text.service';

export interface ConfirmDialogData {
  titleKey: string;
  titleParams?: UiTextParams;
  messageKey: string;
  messageParams?: UiTextParams;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
}
