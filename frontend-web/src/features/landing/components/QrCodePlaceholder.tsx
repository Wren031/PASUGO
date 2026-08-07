import { cn } from '@/lib/utils';

interface QrCodePlaceholderProps {
  className?: string;
}

const modules = [
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
  [1, 0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 0, 1, 0],
  [1, 0, 1, 0, 0, 1, 0, 1, 1],
  [1, 1, 1, 1, 0, 0, 1, 0, 1],
];

export default function QrCodePlaceholder({ className }: QrCodePlaceholderProps) {
  return (
    <div className={cn('grid grid-cols-9 gap-[2px] rounded-md bg-white p-2', className)} role="img" aria-label="QR code placeholder">
      {modules.flatMap((row, rowIndex) =>
        row.map((filled, colIndex) => (
          <span key={`${rowIndex}-${colIndex}`} className={cn('aspect-square rounded-[1px]', filled ? 'bg-slate-900' : 'bg-white')} />
        )),
      )}
    </div>
  );
}
