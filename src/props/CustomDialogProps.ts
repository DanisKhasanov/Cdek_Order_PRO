import { ReactNode } from "react";

export interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: ReactNode;
  actions?: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  showCloseIcon?: boolean;
  showWarningIcon?: boolean;
}
