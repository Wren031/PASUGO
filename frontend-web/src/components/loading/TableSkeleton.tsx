interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 6, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex animate-pulse flex-col">
        <div className="flex gap-6 border-b border-slate-200 bg-slate-50 px-4 py-3">
          {Array.from({ length: columns }, (_, index) => (
            <div key={index} className="h-3 flex-1 rounded bg-slate-200" />
          ))}
        </div>
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex gap-6 border-b border-slate-100 px-4 py-4 last:border-0">
            {Array.from({ length: columns }, (_, colIndex) => (
              <div key={colIndex} className="h-3.5 flex-1 rounded bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
