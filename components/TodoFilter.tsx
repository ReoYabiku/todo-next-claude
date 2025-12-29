'use client';

import { FilterType } from '@/types/todo';

interface TodoFilterProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  activeCount: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export default function TodoFilter({
  filter,
  setFilter,
  activeCount,
  hasCompleted,
  onClearCompleted,
}: TodoFilterProps) {
  const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: 'すべて' },
    { type: 'active', label: '進行中' },
    { type: 'completed', label: '完了' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
      <div className="flex gap-2">
        {filters.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          残り: <span className="font-semibold">{activeCount}</span>件
        </span>
        {hasCompleted && (
          <button
            onClick={onClearCompleted}
            className="text-sm text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            完了を削除
          </button>
        )}
      </div>
    </div>
  );
}
