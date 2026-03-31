import Link from "next/link";
import { LayoutGrid, Search, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/search", label: "検索", icon: Search },
  { href: "/actresses", label: "一覧", icon: LayoutGrid },
  { href: "/settings", label: "設定", icon: Settings },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a1a1a] flex flex-col">
      {/* 共通ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0a1a1a]/95 backdrop-blur border-b border-[#1e3333] flex items-center px-6">
        <Link
          href="/actresses"
          className="text-lg font-bold text-white tracking-wide hover:text-[#00d4d4] transition-colors"
        >
          MuseLog
          <span role="img" aria-label="muse">
            💋
          </span>
        </Link>
      </header>

      {/* ヘッダー分のオフセット */}
      <main className="flex-1 pt-16 pb-20">{children}</main>

      {/* ボトムナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1f1f] border-t border-[#1e3333] flex justify-around items-center h-16 z-40">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-6 py-2 text-gray-500 hover:text-[#00d4d4] transition-colors [&.active]:text-[#00d4d4]"
          >
            <Icon size={22} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
