import { FiFileText, FiImage } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import type { VerificationDocument } from '../types';

interface DocumentPreviewProps {
  document: VerificationDocument;
  className?: string;
}

export default function DocumentPreview({ document, className }: DocumentPreviewProps) {
  const isImage = document.name.endsWith('.jpg') || document.name.endsWith('.png') || document.name.endsWith('.jpeg');
  const Icon = isImage ? FiImage : FiFileText;

  return (
    <div
      className={cn(
        'flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg border bg-slate-100 text-slate-400',
        className,
      )}
    >
      {isImage ? (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="absolute inset-4 rounded-lg border-2 border-dashed border-slate-300" />
          <div className="relative flex flex-col items-center gap-1.5">
            <Icon size={26} className="text-slate-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Document image</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <Icon size={26} />
          <span className="text-[10px] font-semibold uppercase tracking-wide">{document.name.split('.').pop()?.toUpperCase()} file</span>
        </div>
      )}
    </div>
  );
}
