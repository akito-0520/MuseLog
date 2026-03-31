"use client";

import { AVAILABLE_TAGS, MAX_TAGS } from "@/lib/constants/review";

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelector({ selected, onChange }: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (selected.length < MAX_TAGS) {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-gray-600">
        {selected.length}/{MAX_TAGS} 個選択中
      </span>
      <div className="flex flex-wrap gap-1.5">
        {AVAILABLE_TAGS.map((tag) => {
          const isSelected = selected.includes(tag);
          const disabled = !isSelected && selected.length >= MAX_TAGS;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              disabled={disabled}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                isSelected
                  ? "bg-[#00d4d4]/15 border-[#00d4d4]/60 text-[#00d4d4]"
                  : disabled
                    ? "border-[#1a2e2e] text-gray-700 cursor-not-allowed"
                    : "border-[#1e3333] text-gray-400 hover:border-[#00d4d4]/50 hover:text-gray-200 hover:bg-[#1a2e2e]"
              }`}
            >
              {isSelected ? `✓ ${tag}` : tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
