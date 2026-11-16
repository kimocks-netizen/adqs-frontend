import type { ReactNode } from 'react';

export interface MobileRow {
  id: string;
  primary: ReactNode;
  secondary?: ReactNode;
  badge?: ReactNode;
  fields?: { label: string; value: ReactNode }[];
  actions?: ReactNode;
}

export function MobileTable({ rows, empty = 'No records found.' }: { rows: MobileRow[]; empty?: string }) {
  if (rows.length === 0) {
    return (
      <p className="md:hidden rounded-xl border border-gray-100 bg-white px-5 py-12 text-center text-sm text-gray-400">
        {empty}
      </p>
    );
  }

  return (
    <div className="md:hidden space-y-2">
      {rows.map((row) => (
        <div key={row.id} className="bg-white rounded-xl border border-gray-100 shadow-card px-4 py-3 space-y-2">
          {/* Top row: primary + badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{row.primary}</p>
              {row.secondary && <p className="mt-0.5 text-xs text-gray-400 truncate">{row.secondary}</p>}
            </div>
            {row.badge && <div className="shrink-0">{row.badge}</div>}
          </div>

          {/* Fields grid */}
          {row.fields && row.fields.length > 0 && (
            <div className={`grid gap-x-3 gap-y-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs grid-cols-${Math.min(row.fields.length, 3)}`}>
              {row.fields.map((f) => (
                <div key={f.label}>
                  <p className="text-gray-400">{f.label}</p>
                  <p className="font-medium text-gray-700">{f.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {row.actions && (
            <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
              {row.actions}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
