"use client";

/**
 * 女優詳細・評価編集ページ
 * 依存: react-hook-form, zod, @hookform/resolvers, @radix-ui/react-dialog
 */

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ChevronLeft,
  Star,
  Plus,
  Trash2,
  ExternalLink,
  User,
  Check,
} from "lucide-react";
import {
  reviewEditSchema,
  type ReviewEditFormValues,
} from "@/lib/schemas/review";
import type { Review } from "@/lib/types/review";

// ── 定数 ──────────────────────────────────────────────────────

const AVAILABLE_TAGS = [
  "美人",
  "かわいい",
  "清楚",
  "スレンダー",
  "グラマー",
  "アイドル",
  "クール",
  "元気",
  "癒し系",
  "天然",
  "セクシー",
  "上品",
  "笑顔",
  "スポーティ",
  "モデル系",
];

const MAX_TAGS = 5;
const MAX_MEMO = 500;

// ── モックデータ ──────────────────────────────────────────────

function getMockReview(id: number): Review | null {
  // TODO: TanStack Query + 実 API に差し替え
  const MOCK_REVIEWS: Review[] = [
    {
      id: 1,
      actress: {
        id: 1,
        name: "新垣 結衣",
        image_url: null,
        fanza_url: "https://www.dmm.co.jp",
        height: 163,
        bust: 82,
        waist: 59,
        hips: 86,
        cup: "B",
      },
      rating: 5.0,
      tags: ["美人", "スレンダー"],
      memo: "代表作: 逃げるは恥だが役に立つ",
      favorite_videos: [
        { title: "逃げるは恥だが役に立つ", url: "https://www.dmm.co.jp" },
      ],
      created_at: "2023-10-24T00:00:00Z",
      updated_at: "2023-10-24T00:00:00Z",
    },
    {
      id: 2,
      actress: {
        id: 2,
        name: "石原 さとみ",
        image_url: null,
        fanza_url: "https://www.dmm.co.jp",
        height: 158,
        bust: 83,
        waist: 58,
        hips: 84,
        cup: "C",
      },
      rating: 4.9,
      tags: ["美人", "清楚"],
      memo: null,
      favorite_videos: [],
      created_at: "2023-09-15T00:00:00Z",
      updated_at: "2023-09-15T00:00:00Z",
    },
    {
      id: 3,
      actress: {
        id: 3,
        name: "橋本 環奈",
        image_url: null,
        fanza_url: "",
        height: 158,
        bust: null,
        waist: null,
        hips: null,
        cup: null,
      },
      rating: 4.8,
      tags: ["アイドル", "かわいい"],
      memo: null,
      favorite_videos: [],
      created_at: "2023-10-21T00:00:00Z",
      updated_at: "2023-10-21T00:00:00Z",
    },
  ];
  return MOCK_REVIEWS.find((r) => r.id === id) ?? null;
}

// ── 削除確認ダイアログ ─────────────────────────────────────────

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

// ── 星評価インタラクティブコンポーネント ──────────────────────

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
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
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              className="transition-transform hover:scale-110 active:scale-95"
              aria-label={`${star}星`}
            >
              <Star
                size={30}
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
      <span className="text-yellow-400 font-semibold text-xl min-w-[2.5rem]">
        {(hovered ?? value).toFixed(1)}
      </span>
    </div>
  );
}

// ── タグセレクター ─────────────────────────────────────────────

function TagSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (selected.length < MAX_TAGS) {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* カウンター */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">
          {selected.length}/{MAX_TAGS} 個選択中
        </span>
      </div>

      {/* タグ一覧 */}
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

// ── 小コンポーネント ──────────────────────────────────────────

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 w-24 shrink-0">{label}</span>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}

function FormSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#0d1f1f] border border-[#1e3333]">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        {hint && <span className="text-xs text-gray-600">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ── メインページ ──────────────────────────────────────────────

export default function ActressEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  // TODO: useQuery で API から取得に差し替え
  const review = getMockReview(id);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<ReviewEditFormValues>({
    resolver: zodResolver(reviewEditSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      rating: review?.rating ?? 3,
      tags: review?.tags ?? [],
      memo: review?.memo ?? "",
      favorite_videos: review?.favorite_videos ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "favorite_videos",
  });

  const memo = watch("memo") ?? "";

  if (!review) {
    return (
      <div className="min-h-screen bg-[#0a1a1a] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-sm">データが見つかりません</p>
        <Link
          href="/actresses"
          className="text-[#00d4d4] text-sm hover:text-[#00ffff] transition-colors"
        >
          ← 一覧に戻る
        </Link>
      </div>
    );
  }

  const { actress } = review;
  const hasThreeSizes =
    actress.bust !== null || actress.waist !== null || actress.hips !== null;

  const onSubmit = async (data: ReviewEditFormValues) => {
    // TODO: API mutation に差し替え
    console.log("Update review:", data);
    await new Promise((r) => setTimeout(r, 600));
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  const handleDelete = () => {
    // TODO: API delete mutation に差し替え
    console.log("Delete review:", review.id);
    setShowDeleteConfirm(false);
    router.push("/actresses");
  };

  return (
    <div className="min-h-screen bg-[#0a1a1a] text-white pb-36">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 bg-[#0a1a1a]/95 backdrop-blur border-b border-[#1e3333]/60 px-4 py-3 flex items-center gap-3">
        <Link
          href="/actresses"
          className="p-1.5 -ml-1.5 rounded-full text-gray-400 hover:text-white transition-colors"
          aria-label="戻る"
        >
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-base font-semibold text-white truncate flex-1">
          {actress.name}
        </h1>
        {isDirty && (
          <span className="text-xs text-yellow-500 shrink-0">未保存</span>
        )}
      </header>

      {/* メインコンテンツ */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-3xl mx-auto px-4 py-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 lg:items-start">
          {/* ── 左側: 女優情報カード ── */}
          <div className="mb-6 lg:mb-0 lg:sticky lg:top-[61px]">
            <div className="rounded-2xl bg-[#0d1f1f] border border-[#1e3333] overflow-hidden">
              {/* 画像 */}
              <div className="relative w-full aspect-[2/3] bg-[#1a2e2e]">
                {actress.image_url ? (
                  <Image
                    src={actress.image_url}
                    alt={actress.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 260px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={64} className="text-gray-700" />
                  </div>
                )}
              </div>

              {/* スペック情報 */}
              <div className="p-4 flex flex-col gap-3">
                <h2 className="text-base font-bold text-white">
                  {actress.name}
                </h2>
                <div className="flex flex-col gap-1.5">
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
          </div>

          {/* ── 右側: 編集フォーム ── */}
          <div className="flex flex-col gap-4">
            {/* 星評価 */}
            <FormSection title="評価">
              <Controller
                control={control}
                name="rating"
                render={({ field }) => (
                  <StarRatingInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.rating && (
                <p className="text-xs text-red-400">{errors.rating.message}</p>
              )}
            </FormSection>

            {/* タグ */}
            <FormSection title="タグ" hint={`最大${MAX_TAGS}個`}>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <TagSelector
                    selected={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.tags && (
                <p className="text-xs text-red-400">{errors.tags.message}</p>
              )}
            </FormSection>

            {/* メモ */}
            <FormSection title="メモ">
              <div className="relative">
                <textarea
                  {...register("memo")}
                  placeholder="メモを入力..."
                  rows={4}
                  maxLength={MAX_MEMO}
                  className="w-full rounded-xl bg-[#1a2e2e] border border-[#1e3333] text-white placeholder-gray-600 px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#00d4d4] transition-colors"
                />
                <span className="absolute bottom-3 right-3 text-xs text-gray-600 pointer-events-none">
                  {memo.length}/{MAX_MEMO}
                </span>
              </div>
              {errors.memo && (
                <p className="text-xs text-red-400">{errors.memo.message}</p>
              )}
            </FormSection>

            {/* お気に入り動画 */}
            <FormSection title="お気に入り動画">
              <div className="flex flex-col gap-3">
                {fields.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-2">
                    動画が追加されていません
                  </p>
                )}
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 p-3 rounded-xl bg-[#1a2e2e] border border-[#1e3333]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">
                        動画 {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 text-gray-600 hover:text-red-400 transition-colors rounded-lg"
                        aria-label="削除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input
                      {...register(`favorite_videos.${index}.title`)}
                      placeholder="タイトル"
                      className="w-full rounded-lg bg-[#112222] border border-[#1e3333] text-white placeholder-gray-600 px-3 py-2 text-sm focus:outline-none focus:border-[#00d4d4] transition-colors"
                    />
                    {errors.favorite_videos?.[index]?.title && (
                      <p className="text-xs text-red-400 -mt-1">
                        {errors.favorite_videos[index]?.title?.message}
                      </p>
                    )}
                    <input
                      {...register(`favorite_videos.${index}.url`)}
                      placeholder="URL (https://...)"
                      type="url"
                      className="w-full rounded-lg bg-[#112222] border border-[#1e3333] text-white placeholder-gray-600 px-3 py-2 text-sm focus:outline-none focus:border-[#00d4d4] transition-colors"
                    />
                    {errors.favorite_videos?.[index]?.url && (
                      <p className="text-xs text-red-400 -mt-1">
                        {errors.favorite_videos[index]?.url?.message}
                      </p>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append({ title: "", url: "" })}
                  className="flex items-center gap-2 w-full py-3 rounded-xl border border-dashed border-[#1e3333] text-gray-500 hover:border-[#00d4d4]/50 hover:text-[#00d4d4] transition-colors text-sm justify-center"
                >
                  <Plus size={15} />
                  動画を追加
                </button>
              </div>
            </FormSection>

            {/* 削除エリア */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 border border-red-900/40 hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={15} />
                お気に入りから削除
              </button>
            </div>
          </div>
        </div>

        {/* 固定フッター: FANZAリンク + 更新ボタン */}
        <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#0a1a1a]/95 backdrop-blur border-t border-[#1e3333]">
          <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
            {actress.fanza_url ? (
              <a
                href={actress.fanza_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#00d4d4] transition-colors shrink-0"
              >
                <ExternalLink size={13} />
                公式ページ
              </a>
            ) : (
              <span className="text-xs text-gray-700">公式ページ未設定</span>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[#00d4d4] hover:bg-[#00bfbf] active:bg-[#00aaaa] disabled:opacity-40 disabled:cursor-not-allowed text-[#0a1a1a] transition-colors min-w-[100px] justify-center"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-[#0a1a1a]/30 border-t-[#0a1a1a] rounded-full animate-spin" />
                ) : isSuccess ? (
                  <>
                    <Check size={15} />
                    保存済み
                  </>
                ) : (
                  "更新する"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* 削除確認ダイアログ */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
