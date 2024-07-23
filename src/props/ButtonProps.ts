export interface ButtonProps {
  type?: "button" | "submit" | "reset"; 
  onClick?: () => void; 
  className?: string; 
  children?: React.ReactNode; 
  disabled?: boolean; 
}