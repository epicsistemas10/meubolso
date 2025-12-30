import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-bg-card rounded-lg border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
