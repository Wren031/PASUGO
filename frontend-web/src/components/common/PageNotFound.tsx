import type { ReactNode } from 'react';
import { FiSearch } from 'react-icons/fi';
import type { IconType } from 'react-icons';

interface PageNotFoundProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function PageNotFound({
  title = 'Page not found',
  description = 'The page you are looking for could not be found.',
  action,
}: PageNotFoundProps) {
  const Icon: IconType = FiSearch;
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
        <Icon size={28} />
      </span>
      <div>
        <p className="text-5xl font-extrabold tracking-tight text-slate-900">404</p>
        <h1 className="mt-2 text-lg font-bold text-slate-900">{title}</h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
