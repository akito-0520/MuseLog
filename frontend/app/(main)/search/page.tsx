"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, Plus, Check, X, User } from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AddReviewModal } from "./_components/AddReviewModal";
import type { AddReviewValues } from "./_components/AddReviewModal";
import type { DmmActress } from "@/lib/types/actress";

// ── API ───────────────────────────────────────────────────────

const PER_PAGE = 20;

interface DmmSearchResponse {
  actresses: DmmActress[];
  total: number;
  page: number;
  per_page: number;
}

async function searchActresses(
  keyword: string,
  page: number
): Promise<DmmSearchResponse> {
  // TODO: バックエンド接続後は fetch に差し替え
  // const res = await fetch(
  //   `/api/dmm/actresses?keyword=${encodeURIComponent(keyword)}&page=${page}&per_page=${PER_PAGE}`
  // );
  // if (!res.ok) throw new Error("検索に失敗しました");
  // return res.json();

  await new Promise((r) => setTimeout(r, 500));

  const MOCK_ACTRESSES: DmmActress[] = [
    {
      id: "d001",
      name: "葵つかさ",
      ruby: "あおい つかさ",
      image_url: null,
      fanza_url: "",
      height: 161,
      bust: 88,
      waist: 58,
      hips: 85,
      cup: "E",
    },
    {
      id: "d002",
      name: "天使もえ",
      ruby: "てんし もえ",
      image_url: null,
      fanza_url: "",
      height: 155,
      bust: 90,
      waist: 58,
      hips: 86,
      cup: "F",
    },
    {
      id: "d003",
      name: "橋本ありな",
      ruby: "はしもと ありな",
      image_url: null,
      fanza_url: "",
      height: 158,
      bust: 83,
      waist: 58,
      hips: 84,
      cup: "C",
    },
    {
      id: "d004",
      name: "明日花キララ",
      ruby: "あすか きらら",
      image_url: null,
      fanza_url: "",
      height: 165,
      bust: 92,
      waist: 58,
      hips: 88,
      cup: "G",
    },
    {
      id: "d005",
      name: "三上悠亜",
      ruby: "みかみ ゆあ",
      image_url: null,
      fanza_url: "",
      height: 163,
      bust: 83,
      waist: 58,
      hips: 85,
      cup: "C",
    },
    {
      id: "d006",
      name: "波多野結衣",
      ruby: "はたの ゆい",
      image_url: null,
      fanza_url: "",
      height: 163,
      bust: 88,
      waist: 58,
      hips: 85,
      cup: "E",
    },
    {
      id: "d007",
      name: "吉高寧々",
      ruby: "よしたか ねね",
      image_url: null,
      fanza_url: "",
      height: 159,
      bust: 85,
      waist: 57,
      hips: 84,
      cup: "D",
    },
    {
      id: "d008",
      name: "深田えいみ",
      ruby: "ふかだ えいみ",
      image_url: null,
      fanza_url: "",
      height: 163,
      bust: 90,
      waist: 58,
      hips: 88,
      cup: "F",
    },
    {
      id: "d009",
      name: "夢乃あいか",
      ruby: "ゆめの あいか",
      image_url: null,
      fanza_url: "",
      height: 160,
      bust: 85,
      waist: 58,
      hips: 86,
      cup: "D",
    },
    {
      id: "d010",
      name: "桃乃木かな",
      ruby: "もものぎ かな",
      image_url: null,
      fanza_url: "",
      height: 157,
      bust: 83,
      waist: 57,
      hips: 84,
      cup: "C",
    },
  ];

  const kw = keyword.trim().toLowerCase();
  const filtered = MOCK_ACTRESSES.filter((a) => {
    const name = a.name.replace(/\s/g, "").toLowerCase();
    const ruby = (a.ruby ?? "").replace(/\s/g, "").toLowerCase();
    return name.includes(kw) || ruby.includes(kw);
  });

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return { actresses: paged, total, page, per_page: PER_PAGE };
}

// ── トースト ──────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#00d4d4] text-[#0a1a1a] text-sm font-medium shadow-xl">
      <Check size={15} strokeWidth={2.5} />
      {message}
    </div>
  );
}

// ── スペックタグ ──────────────────────────────────────────────

function SpecTag({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <span className="w-1 h-1 rounded-full bg-gray-600 inline-block" />
      {label}
    </span>
  );
}

// ── リスト行カード ─────────────────────────────────────────────

function ActressRow({
  actress,
  isFavorite,
  onAdd,
}: {
  actress: DmmActress;
  isFavorite: boolean;
  onAdd: () => void;
}) {
  const specs: string[] = [];
  if (actress.height) specs.push(`T${actress.height}`);
  if (actress.bust)
    specs.push(`B${actress.bust}${actress.cup ? `(${actress.cup})` : ""}`);
  if (actress.waist) specs.push(`W${actress.waist}`);

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1f1f] rounded-2xl border border-[#1a2e2e]">
      {/* サムネイル */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#1a2e2e] shrink-0">
        {actress.image_url ? (
          <Image
            src={actress.image_url}
            alt={actress.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={28} className="text-gray-600" />
          </div>
        )}
      </div>

      {/* テキスト情報 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-base font-bold text-white truncate">
            {actress.name}
          </span>
          {actress.ruby && (
            <span className="text-xs text-gray-500 truncate shrink-0">
              {actress.ruby}
            </span>
          )}
        </div>
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            {specs.map((s) => (
              <SpecTag key={s} label={s} />
            ))}
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="shrink-0">
        {isFavorite ? (
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-10 h-10 rounded-full bg-[#1a2e2e] border border-[#1e3333] flex items-center justify-center">
              <Check size={18} className="text-gray-500" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] text-gray-500">登録済</span>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="w-10 h-10 rounded-full bg-[#00d4d4] hover:bg-[#00bfbf] active:bg-[#00aaaa] text-[#0a1a1a] flex items-center justify-center transition-colors shadow-md"
            aria-label={`${actress.name}を追加`}
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── スケルトン ────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1f1f] rounded-2xl border border-[#1a2e2e]">
      <div className="w-16 h-16 rounded-xl bg-[#1a2e2e] animate-pulse shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-1/2 rounded bg-[#1a2e2e] animate-pulse" />
        <div className="h-3 w-3/4 rounded bg-[#1a2e2e] animate-pulse" />
      </div>
      <div className="w-10 h-10 rounded-full bg-[#1a2e2e] animate-pulse shrink-0" />
    </div>
  );
}

// ── メインページ ──────────────────────────────────────────────

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [addTarget, setAddTarget] = useState<DmmActress | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = useCallback((value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setKeyword(value);
      setPage(1);
    }, 400);
  }, []);

  const handleClear = () => {
    setInputValue("");
    setKeyword("");
    setPage(1);
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["dmm-actresses", { keyword, page }],
    queryFn: () => searchActresses(keyword, page),
    placeholderData: keepPreviousData,
    enabled: keyword.trim().length > 0,
  });

  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0;

  const handleConfirm = (values: AddReviewValues) => {
    if (!addTarget) return;
    // TODO: バックエンド接続後は mutation に差し替え
    setFavorites((prev) => new Set(prev).add(addTarget.id));
    setToast(`${addTarget.name} をお気に入りに追加しました`);
    setAddTarget(null);
    console.log("Added:", addTarget.name, values);
  };

  return (
    <div className="min-h-screen bg-[#0a1a1a] text-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 bg-[#0a1a1a]/95 backdrop-blur px-4 pt-12 pb-3">
        <h1 className="text-2xl font-bold text-center mb-4">女優検索</h1>

        {/* 検索バー */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="女優名で検索..."
            autoFocus
            className="w-full rounded-2xl bg-[#0d1f1f] border border-[#1a2e2e] text-white placeholder-gray-500 pl-9 pr-10 py-3 text-sm focus:outline-none focus:border-[#00d4d4] transition-colors"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* 件数 + クリア */}
        {data && !isLoading && keyword && (
          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-xs text-gray-400">検索結果: {data.total}件</p>
            <button
              onClick={handleClear}
              className="text-xs text-[#00d4d4] hover:text-[#00ffff] transition-colors"
            >
              条件をクリア
            </button>
          </div>
        )}
      </header>

      {/* コンテンツ */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* エラー */}
        {isError && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-red-400 text-sm">検索に失敗しました</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[#00d4d4] text-sm hover:text-[#00ffff] transition-colors"
            >
              再読み込み
            </button>
          </div>
        )}

        {/* スケルトン */}
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)}

        {/* 結果なし */}
        {!isLoading && !isError && keyword && data?.actresses.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-28 text-center">
            <User size={48} className="text-gray-700" />
            <p className="text-gray-400 text-sm">
              「{keyword}」に一致する女優が見つかりませんでした
            </p>
          </div>
        )}

        {/* 検索結果リスト */}
        {!isError && data && data.actresses.length > 0 && (
          <>
            {data.actresses.map((actress) => (
              <ActressRow
                key={actress.id}
                actress={actress}
                isFavorite={favorites.has(actress.id)}
                onAdd={() => setAddTarget(actress)}
              />
            ))}

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg bg-[#0d1f1f] border border-[#1a2e2e] text-sm text-gray-400 disabled:opacity-40 hover:text-white transition-colors"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#00d4d4] text-[#0a1a1a]"
                          : "bg-[#0d1f1f] border border-[#1a2e2e] text-gray-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-[#0d1f1f] border border-[#1a2e2e] text-sm text-gray-400 disabled:opacity-40 hover:text-white transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}

        {/* ページ切り替え中のローディング */}
        {isFetching && !isLoading && (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 rounded-full border-2 border-[#1a2e2e] border-t-[#00d4d4] animate-spin" />
          </div>
        )}
      </div>

      {/* 登録モーダル */}
      <AddReviewModal
        actress={addTarget}
        open={addTarget !== null}
        onClose={() => setAddTarget(null)}
        onConfirm={handleConfirm}
      />

      {/* トースト */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
