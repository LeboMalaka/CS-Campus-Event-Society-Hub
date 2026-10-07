const categories = ['All', 'Workshop', 'Social', 'Academic', 'Career', 'Sports', 'Volunteering'];

export default function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            selected === category
              ? 'border-violet-500 bg-violet-500/15 text-violet-200'
              : 'border-violet-500/20 bg-[#17171d] text-slate-300 hover:border-violet-400/70 hover:text-violet-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
