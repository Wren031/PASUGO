import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <header className="mb-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
      </header>
      {children}
      {footer && <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">{footer}</div>}
      <div className="mt-6 text-center">
        <Link to="/" className="text-xs font-medium text-slate-400 transition-colors hover:text-primary-500">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
