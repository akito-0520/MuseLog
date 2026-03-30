"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X, ExternalLink, User, Plus, Trash2 } from "lucide-react";
import type { DmmActress } from "@/lib/types/actress";
import { MAX_MEMO } from "@/lib/constants/review";
import { SpecRow } from "@/app/(main)/_components/SpecRow";
import { Section } from "@/app/(main)/_components/Section";
import { StarRatingInput } from "@/app/(main)/_components/StarRatingInput";
import { TagSelector } from "@/app/(main)/_components/TagSelector";

// 型を re-export して page.tsx から参照できるようにする
export type { DmmActress };

export interface AddReviewValues {
  rating: number | null;
  tags: string[];
  memo: string;
  favorite_videos: { title: string; url: string }[];
}

interface AddReviewModalProps {
  actress: DmmActress | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (values: AddReviewValues) => void;
}

export function AddReviewModal({
  actress,
  open,
  onClose,
  onConfirm,
}: AddReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [videos, setVideos] = useState<{ title: string; url: string }[]>([]);

  if (!actress) return null;

  const hasThreeSizes =
    actress.bust !== null || actress.waist !== null || actress.hips !== null;

  const addVideo = () => setVideos((prev) => [...prev, { title: "", url: "" }]);

  const updateVideo = (i: number, field: "title" | "url", value: string) =>
    setVideos((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v))
    );

  const removeVideo = (i: number) =>
    setVideos((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    onConfirm({
      rating: rating > 0 ? rating : null,
      tags,
      memo,
      favorite_videos: videos.filter((v) => v.title.trim() && v.url.trim()),
    });
    // フォームリセット
    setRating(0);
    setTags([]);
    setMemo("");
    setVideos([]);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-2rem)] max-w-[600px] max-h-[90dvh] rounded-2xl bg-[#0d1f1f] border border-[#1e3333] shadow-2xl overflow-hidden flex flex-col p-0"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">
          {actress.name} をお気に入りに追加
        </DialogTitle>

        {/* 閉じるボタン */}
        <DialogClose asChild>
          <button
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-gray-400 hover:text-white transition-colors"
            aria-label="閉じる"
          >
            <X size={18} />
          </button>
        </DialogClose>

        {/* スクロール可能なコンテンツ */}
        <div className="overflow-y-auto flex-1">
          {/* 上部: 画像 + 基本情報 */}
          <div className="flex gap-4 p-5">
            {/* 画像 */}
            <div className="relative w-32 shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-[#1a2e2e]">
              {actress.image_url ? (
                <Image
                  src={actress.image_url}
                  alt={actress.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={36} className="text-gray-600" />
                </div>
              )}
            </div>

            {/* 基本情報 */}
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {actress.name}
                </h2>
                {actress.ruby && (
                  <p className="text-xs text-gray-500 mt-0.5">{actress.ruby}</p>
                )}
              </div>

              {/* 星評価入力 */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-gray-500">評価（任意）</span>
                <StarRatingInput
                  value={rating}
                  onChange={setRating}
                  size={22}
                  allowZero
                />
              </div>

              {/* スペック */}
              <div className="flex flex-col gap-1">
                {actress.height !== null && (
                  <SpecRow label="身長" value={`${actress.height} cm`} />
                )}
                {hasThreeSizes && (
                  <SpecRow
                    label="スリーサイズ"
                    value={[
                      actress.bust !== null ? `B${actress.bust}` : null,
                      actress.waist !== null ? `W${actress.waist}` : null,
                      actress.hips !== null ? `H${actress.hips}` : null,
                    ]
                      .filter(Boolean)
                      .join(" / ")}
                  />
                )}
                {actress.cup !== null && (
                  <SpecRow label="カップ" value={`${actress.cup}カップ`} />
                )}
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 flex flex-col gap-5">
            {/* タグ */}
            <Section title="タグ（最大5個）">
              <TagSelector selected={tags} onChange={setTags} />
            </Section>

            {/* メモ */}
            <Section title="メモ">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                maxLength={MAX_MEMO}
                rows={3}
                placeholder="メモを入力..."
                className="w-full rounded-xl bg-[#1a2e2e] border border-[#1e3333] text-sm text-white placeholder-gray-600 px-3 py-2.5 resize-none focus:outline-none focus:border-[#00d4d4] transition-colors"
              />
              <p className="text-xs text-gray-600 text-right">
                {memo.length} / {MAX_MEMO}
              </p>
            </Section>

            {/* お気に入り動画 */}
            <Section title="お気に入り動画（任意）">
              {videos.length > 0 && (
                <div className="flex flex-col gap-2">
                  {videos.map((v, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#1a2e2e] border border-[#1e3333]"
                    >
                      <input
                        type="text"
                        value={v.title}
                        onChange={(e) =>
                          updateVideo(i, "title", e.target.value)
                        }
                        placeholder="タイトル"
                        className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                      />
                      <div className="h-px bg-[#1e3333]" />
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={v.url}
                          onChange={(e) =>
                            updateVideo(i, "url", e.target.value)
                          }
                          placeholder="URL"
                          className="flex-1 bg-transparent text-sm text-gray-400 placeholder-gray-600 focus:outline-none"
                        />
                        <button
                          onClick={() => removeVideo(i)}
                          className="text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={addVideo}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00d4d4] transition-colors"
              >
                <Plus size={13} />
                動画を追加
              </button>
            </Section>
          </div>
        </div>

        {/* フッター */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-[#1e3333] bg-[#0a1a1a]/60">
          {/* FANZA リンク */}
          {actress.fanza_url && (
            <a
              href={actress.fanza_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#00d4d4] transition-colors mr-auto"
            >
              <ExternalLink size={13} />
              FANZA
            </a>
          )}

          {/* スキップ（評価なしで追加） */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-[#1a2e2e] transition-colors"
          >
            キャンセル
          </button>

          {/* 追加ボタン */}
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-[#00d4d4] hover:bg-[#00bfbf] text-[#0a1a1a] transition-colors"
          >
            <Plus size={14} strokeWidth={2.5} />
            追加する
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
