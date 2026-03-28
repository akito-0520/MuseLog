"use client";

/**
 * 女優詳細モーダル
 * 依存: npm install @radix-ui/react-dialog
 */

import { useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Star,
  ExternalLink,
  Pencil,
  Trash2,
  User,
  ChevronRight,
} from "lucide-react";
import type { Review } from "@/lib/types/review";

// ── 削除確認モーダル ──────────────────────────────────────────

function DeleteConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#112222] border border-[#1e3333] p-6 shadow-xl animate-in fade-in zoom-in-95">
          <Dialog.Title className="text-base font-semibold text-white mb-2">
            お気に入りから削除
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400 mb-6">
            このお気に入りを削除しますか？この操作は元に戻せません。
          </Dialog.Description>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-sm text-gray-300 bg-[#1a2e2e] hover:bg-[#1e3333] transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-700/80 hover:bg-red-700 transition-colors"
            >
              削除する
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── メインモーダル ────────────────────────────────────────────

interface ActressDetailModalProps {
  review: Review | null;
  open: boolean;
  onClose: () => void;
  onDelete: (reviewId: number) => void;
}

export function ActressDetailModal({
  review,
  open,
  onClose,
  onDelete,
}: ActressDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!review) return null;

  const { actress } = review;

  const hasThreeSizes =
    actress.bust !== null || actress.waist !== null || actress.hips !== null;

  const handleDelete = () => {
    onDelete(review.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
        <Dialog.Portal>
          {/* オーバーレイ */}
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* モーダル本体 */}
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-40 w-[calc(100%-2rem)] max-w-[600px] max-h-[90dvh] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#0d1f1f] border border-[#1e3333] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">
              {actress.name} の詳細
            </Dialog.Title>

            {/* 閉じるボタン */}
            <Dialog.Close asChild>
              <button
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-gray-400 hover:text-white transition-colors"
                aria-label="閉じる"
              >
                <X size={18} />
              </button>
            </Dialog.Close>

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
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {actress.name}
                  </h2>

                  {/* 星評価 */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.round(review.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600 fill-gray-600"
                        }
                      />
                    ))}
                    <span className="text-sm text-yellow-400 font-medium ml-1">
                      {review.rating.toFixed(1)}
                    </span>
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

              <div className="px-5 pb-5 flex flex-col gap-4">
                {/* タグ */}
                {review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs bg-[#1a2e2e] border border-[#1e3333] text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* メモ */}
                {review.memo && (
                  <Section title="メモ">
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {review.memo}
                    </p>
                  </Section>
                )}

                {/* お気に入り動画 */}
                {review.favorite_videos.length > 0 && (
                  <Section title="お気に入り動画">
                    <ul className="flex flex-col gap-2">
                      {review.favorite_videos.map((video, i) => (
                        <li key={i}>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-[#00d4d4] hover:text-[#00ffff] transition-colors group"
                          >
                            <ExternalLink
                              size={13}
                              className="shrink-0 opacity-70 group-hover:opacity-100"
                            />
                            <span className="truncate">{video.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}
              </div>
            </div>

            {/* フッター: アクションボタン */}
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

              {/* 削除ボタン */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={15} />
                削除
              </button>

              {/* 編集ボタン */}
              <a
                href={`/actresses/${actress.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-[#00d4d4] hover:bg-[#00bfbf] text-[#0a1a1a] transition-colors"
              >
                <Pencil size={14} />
                編集
                <ChevronRight size={14} />
              </a>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 削除確認モーダル */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

// ── 小コンポーネント ──────────────────────────────────────────

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 w-20 shrink-0">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
}
