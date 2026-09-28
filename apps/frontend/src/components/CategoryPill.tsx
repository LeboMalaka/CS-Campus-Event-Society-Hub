import React from 'react';

export type CategoryVariant = 'academic' | 'social' | 'career' | 'sports' | 'volunteering' | 'default';

interface CategoryPillProps {
  label: string;
  isActive?: boolean;
  variant?: CategoryVariant;
  onClick?: () => void;
  className?: string;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  isActive = false,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const variantClasses = {
    academic: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    social: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    career: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    sports: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    volunteering: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    default: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  };

  const activeClasses = 'ring-2 ring-brand-500 bg-brand-500/20 text-brand-100 border-brand-500';

  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-xs font-medium border transition-all
        ${variantClasses[variant]}
        ${isActive ? activeClasses : ''}
        ${className}
      `}
    >
      {label}
    </button>
  );
};
