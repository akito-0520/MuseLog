"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingInputProps {
  value: number;
  onChange: (v: number) => void;
  /** アイコンサイズ（デフォルト 30） */
  size?: number;
  /** 0点（未選択）を許容するか（デフォルト false） */
  allowZero?: boolean;
}

export function StarRatingInput({
  value,
  onChange,
  size = 30,
  allowZero = false,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => {
          const active = (hovered ?? value) >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(allowZero && value === star ? 0 : star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              className="transition-transform hover:scale-110 active:scale-95"
              aria-label={`${star}星`}
            >
              <Star
                size={size}
                className={
                  active
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-700 fill-gray-700"
                }
              />
            </button>
          );
        })}
      </div>
      {value > 0 && (
        <span className="text-yellow-400 font-semibold text-xl min-w-[2.5rem]">
          {(hovered ?? value).toFixed(1)}
        </span>
      )}
    </div>
  );
}
