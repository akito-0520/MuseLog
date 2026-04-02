"use client";

import { useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { Search, SlidersHorizontal, Star, Plus, User } from "lucide-react";
import type { Review, ReviewsResponse } from "@/lib/types/review";
import { ActressDetailModal } from "./_components/ActressDetailModal";

// ── API ───────────────────────────────────────────────────────

type SortKey = "created_at" | "rating_desc" | "rating_asc" | "name";

interface FetchParams {
  page: number;
  sort: SortKey;
  q: string;
}

async function fetchReviews(params: FetchParams): Promise<ReviewsResponse> {
  // TODO: バックエンド接続後は fetch に差し替え
  // const searchParams = new URLSearchParams({
  //   page: String(params.page),
  //   sort: params.sort,
  //   ...(params.q && { q: params.q }),
  // });
  // const res = await fetch(`/api/reviews?${searchParams}`);
  // if (!res.ok) throw new Error("データの取得に失敗しました");
  // return res.json();

  await new Promise((r) => setTimeout(r, 300));

  const ALL_REVIEWS: Review[] = [
    {
      id: 1,
      actress: {
        id: 1,
        name: "新垣 結衣",
        image_url: null,
        fanza_url: "",
        height: 163,
        bust: 82,
        waist: 59,
        hips: 86,
        cup: "B",
      },
      rating: 5.0,
      tags: ["美人", "スレンダー"],
      memo: "代表作: 逃げるは恥だが役に立つ",
      favorite_videos: [],
      created_at: "2023-10-24T00:00:00Z",
      updated_at: "2023-10-24T00:00:00Z",
    },
    {
      id: 2,
      actress: {
        id: 2,
        name: "石原 さとみ",
        image_url: null,
        fanza_url: "",
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
    {
      id: 4,
      actress: {
        id: 4,
        name: "広瀬 すず",
        image_url: null,
        fanza_url: "",
        height: 163,
        bust: 80,
        waist: 57,
        hips: 83,
        cup: "B",
      },
      rating: 4.7,
      tags: ["清楚", "スレンダー"],
      memo: null,
      favorite_videos: [],
      created_at: "2023-10-01T00:00:00Z",
      updated_at: "2023-10-01T00:00:00Z",
    },
    {
      id: 5,
      actress: {
        id: 5,
        name: "有村 架純",
        image_url: null,
        fanza_url: "",
        height: 158,
        bust: 80,
        waist: 57,
        hips: 82,
        cup: "B",
      },
      rating: 4.6,
      tags: ["かわいい", "清楚"],
      memo: null,
      favorite_videos: [],
      created_at: "2023-09-20T00:00:00Z",
      updated_at: "2023-09-20T00:00:00Z",
    },
    {
      id: 6,
      actress: {
        id: 6,
        name: "長澤 まさみ",
        image_url: null,
        fanza_url: "",
        height: 173,
        bust: 84,
        waist: 60,
        hips: 87,
        cup: "C",
      },
      rating: 4.5,
      tags: ["美人", "スレンダー"],
      memo: null,
      favorite_videos: [],
      created_at: "2023-08-10T00:00:00Z",
      updated_at: "2023-08-10T00:00:00Z",
    },
  ];

  let result = [...ALL_REVIEWS];

  if (params.q.trim()) {
    result = result.filter((r) =>
      r.actress.name.replace(/\s/g, "").includes(params.q.replace(/\s/g, ""))
    );
  }
  result.sort((a, b) => {
    switch (params.sort) {
      case "rating_desc":
        return b.rating - a.rating;
      case "rating_asc":
        return a.rating - b.rating;
      case "name":
        return a.actress.name.localeCompare(b.actress.name, "ja");
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  const PER_PAGE = 20;
  const total = result.length;
  const paged = result.slice(
    (params.page - 1) * PER_PAGE,
    params.page * PER_PAGE
  );
  return { reviews: paged, total, page: params.page, per_page: PER_PAGE };
}

// ── 定数 ──────────────────────────────────────────────────────

const PER_PAGE = 20;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "created_at", label: "登録日順" },
  { value: "rating_desc", label: "評価順（高い順）" },
  { value: "rating_asc", label: "評価順（低い順）" },
  { value: "name", label: "名前順（あいうえお）" },
];

// ── ユーティリティ ────────────────────────────────────────────

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `最終更新: ${y}/${m}/${d}`;
}

// ── 女優カード ────────────────────────────────────────────────

function ActressCard({
  review,
  onClick,
}: {
  review: Review;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 cursor-pointer group" onClick={onClick}>
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#112222]">
        {review.actress.image_url ? (
          <Image
            src={review.actress.image_url}
            alt={review.actress.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1a2e2e]">
            <User size={48} className="text-gray-600" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-0.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white truncate">
            {review.actress.name}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-yellow-400 shrink-0 ml-1">
            <Star size={11} fill="currentColor" />
            {review.rating.toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(review.updated_at)}
        </span>
      </div>
    </div>
  );
}

// ── カードスケルトン ──────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full aspect-[2/3] rounded-xl bg-[#1a2e2e] animate-pulse" />
      <div className="flex flex-col gap-1.5 px-0.5">
        <div className="h-4 w-3/4 rounded bg-[#1a2e2e] animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-[#1a2e2e] animate-pulse" />
      </div>
    </div>
  );
}

// ── メインページ ──────────────────────────────────────────────

export default function ActressesPage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("created_at");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { data, isLoading, error } = useSWR(
    ["reviews", page, sort, query],
    ([, page, sort, q]) => fetchReviews({ page, sort: sort as SortKey, q }),
    { keepPreviousData: true }
  );
  const isError = !!error;

  const totalPages = data ? Math.ceil(data.total / PER_PAGE) : 0;

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  // TODO: バックエンド接続後は削除 mutation に差し替え
  const handleDelete = (reviewId: number) => {
    console.log("Delete review:", reviewId);
  };

  return (
    <div className="min-h-screen bg-[#0a1a1a] text-white">
      {/* ヘッダー */}
      <header className="sticky top-12 z-30 bg-[#0a1a1a]/95 backdrop-blur px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">お気に入り一覧</h1>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="ソート"
            >
              <SlidersHorizontal size={22} />
            </button>
            {showSortMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSortMenu(false)}
                />
                <div className="absolute right-0 top-10 z-50 w-52 rounded-xl bg-[#112222] border border-[#1e3333] overflow-hidden shadow-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-[#1a2e2e] ${
                        sort === opt.value
                          ? "text-[#00d4d4] font-medium"
                          : "text-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 検索バー */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="名前で検索..."
            className="w-full rounded-xl bg-[#112222] border border-[#1e3333] text-white placeholder-gray-500 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#00d4d4] transition-colors"
          />
        </div>
      </header>

      {/* コンテンツ */}
      <div className="px-4 py-4">
        {isError && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-red-400 text-sm">データの取得に失敗しました</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[#00d4d4] text-sm hover:text-[#00ffff] transition-colors"
            >
              再読み込み
            </button>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && data?.reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <User size={56} className="text-gray-700" />
            <p className="text-gray-400 text-sm">まだお気に入りがありません</p>
            <a
              href="/search"
              className="text-[#00d4d4] text-sm hover:text-[#00ffff] transition-colors"
            >
              女優を検索して追加する →
            </a>
          </div>
        )}

        {!isError && data && data.reviews.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.reviews.map((review) => (
                <ActressCard
                  key={review.id}
                  review={review}
                  onClick={() => setSelectedReview(review)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg bg-[#112222] border border-[#1e3333] text-sm text-gray-400 disabled:opacity-40 hover:text-white transition-colors"
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
                          : "bg-[#112222] border border-[#1e3333] text-gray-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-[#112222] border border-[#1e3333] text-sm text-gray-400 disabled:opacity-40 hover:text-white transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-[#00d4d4] hover:bg-[#00bfbf] active:bg-[#00aaaa] text-[#0a1a1a] shadow-lg flex items-center justify-center transition-colors"
        aria-label="女優を追加"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* 詳細モーダル */}
      <ActressDetailModal
        review={selectedReview}
        open={selectedReview !== null}
        onClose={() => setSelectedReview(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
