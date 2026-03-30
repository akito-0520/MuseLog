"use client";

import { useState } from "react";
import {
  ChevronRight,
  Mail,
  Lock,
  Trash2,
  LayoutGrid,
  LogOut,
  User,
  Link2,
  Link2Off,
} from "lucide-react";
import { EmailEditModal } from "./_components/EmailEditModal";
import { PasswordEditModal } from "./_components/PasswordEditModal";
import { DeleteAccountModal } from "./_components/DeleteAccountModal";
import { DeleteConfirmDialog } from "@/app/(main)/_components/DeleteConfirmDialog";

// ── 型 ────────────────────────────────────────────────────────

type Modal = "email" | "password" | "deleteAccount" | "logout" | null;
type OAuthProvider = "google" | "github" | "apple";

const PER_PAGE_OPTIONS = [10, 20, 30, 50] as const;
type PerPage = (typeof PER_PAGE_OPTIONS)[number];

// ── OAuth プロバイダー設定 ────────────────────────────────────

interface OAuthProviderConfig {
  id: OAuthProvider;
  name: string;
  icon: React.ReactNode;
}

const OAUTH_PROVIDERS: OAuthProviderConfig[] = [
  {
    id: "google",
    name: "Google",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    id: "apple",
    name: "Apple",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="currentColor"
        aria-hidden="true"
        className="text-white"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
];

// ── 小コンポーネント ──────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-1">
      {title}
    </p>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#0d1f1f] border border-[#1a2e2e] overflow-hidden divide-y divide-[#1a2e2e]">
      {children}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onClick,
  danger,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
  trailing?: React.ReactNode;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
        onClick
          ? danger
            ? "hover:bg-red-900/10 active:bg-red-900/20"
            : "hover:bg-[#112222] active:bg-[#1a2e2e]"
          : ""
      }`}
    >
      <span className={`shrink-0 ${danger ? "text-red-400" : "text-gray-400"}`}>
        {icon}
      </span>
      <span
        className={`flex-1 text-sm font-medium ${danger ? "text-red-400" : "text-white"}`}
      >
        {label}
      </span>
      {trailing ?? (
        <>
          {value && (
            <span className="text-sm text-gray-500 mr-1 truncate max-w-[140px]">
              {value}
            </span>
          )}
          {onClick && (
            <ChevronRight
              size={16}
              className={danger ? "text-red-400/60" : "text-gray-600"}
            />
          )}
        </>
      )}
    </Tag>
  );
}

// ── OAuth 行コンポーネント ─────────────────────────────────────

function OAuthRow({
  provider,
  connected,
  onConnect,
  onDisconnect,
  disabled,
}: {
  provider: OAuthProviderConfig;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="shrink-0 w-[18px] flex items-center justify-center text-gray-400">
        {provider.icon}
      </span>
      <span className="flex-1 text-sm font-medium text-white">
        {provider.name}
      </span>
      {connected ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#00d4d4] flex items-center gap-1">
            <Link2 size={11} />
            連携済み
          </span>
          <button
            onClick={onDisconnect}
            disabled={disabled}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 border border-[#1e3333] hover:border-red-500/50 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Link2Off size={11} />
            解除
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#00d4d4] border border-[#00d4d4]/40 hover:bg-[#00d4d4]/10 transition-colors"
        >
          <Link2 size={11} />
          連携する
        </button>
      )}
    </div>
  );
}

// ── メインページ ──────────────────────────────────────────────

export default function SettingsPage() {
  // ── モック状態 ──
  const [currentEmail] = useState("user@muselog.com");
  const [perPage, setPerPage] = useState<PerPage>(20);

  // ── OAuth 連携状態（TODO: Supabase Auth の identities から取得） ──
  const [connectedProviders, setConnectedProviders] = useState<
    Set<OAuthProvider>
  >(new Set(["google"]));
  const [disconnectTarget, setDisconnectTarget] =
    useState<OAuthProvider | null>(null);

  // 唯一の認証手段かどうかチェック（メールPW + OAuth の合計が1つなら解除不可）
  // ここではメールPW認証は常にある前提でシンプルに実装
  const canDisconnect = (provider: OAuthProvider) =>
    connectedProviders.size > 1 || true; // メールPW認証があるので常に解除可

  // ── モーダル管理 ──
  const [modal, setModal] = useState<Modal>(null);
  const close = () => setModal(null);

  // ── ハンドラ（TODO: 各種APIに差し替え） ──
  const handleEmailSave = async (email: string) => {
    console.log("Update email:", email);
    await new Promise((r) => setTimeout(r, 600));
  };

  const handlePasswordSave = async (current: string, next: string) => {
    console.log("Update password:", current, "→", next);
    await new Promise((r) => setTimeout(r, 600));
  };

  const handleDeleteAccount = async () => {
    console.log("Delete account");
    await new Promise((r) => setTimeout(r, 800));
    // TODO: Supabase Auth の deleteUser → router.push("/login")
    close();
  };

  const handleLogout = () => {
    console.log("Logout");
    // TODO: Supabase Auth の signOut → router.push("/login")
    close();
  };

  const handleConnect = (provider: OAuthProvider) => {
    // TODO: Supabase Auth の signInWithOAuth({ provider, options: { scopes: 'email' } })
    console.log("Connect OAuth:", provider);
    setConnectedProviders((prev) => new Set(prev).add(provider));
  };

  const handleDisconnectConfirm = () => {
    if (!disconnectTarget) return;
    // TODO: Supabase Auth の unlinkIdentity
    console.log("Disconnect OAuth:", disconnectTarget);
    setConnectedProviders((prev) => {
      const next = new Set(prev);
      next.delete(disconnectTarget);
      return next;
    });
    setDisconnectTarget(null);
  };

  return (
    <div className="min-h-screen bg-[#0a1a1a] text-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 bg-[#0a1a1a]/95 backdrop-blur px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold">設定</h1>
      </header>

      <div className="px-4 pb-24 flex flex-col gap-6">
        {/* ── プロフィール ── */}
        <div>
          <SectionHeader title="アカウント" />
          <SettingsCard>
            {/* アカウント概要 */}
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#1a2e2e] border border-[#1e3333] flex items-center justify-center shrink-0">
                <User size={20} className="text-gray-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {currentEmail}
                </span>
                <span className="text-xs text-gray-500">MuseLogアカウント</span>
              </div>
            </div>

            <SettingsRow
              icon={<Mail size={18} />}
              label="メールアドレス"
              value={currentEmail}
              onClick={() => setModal("email")}
            />
            <SettingsRow
              icon={<Lock size={18} />}
              label="パスワード"
              value="変更する"
              onClick={() => setModal("password")}
            />
          </SettingsCard>
        </div>

        {/* ── 連携アカウント ── */}
        <div>
          <SectionHeader title="連携アカウント" />
          <SettingsCard>
            {OAUTH_PROVIDERS.map((provider) => (
              <OAuthRow
                key={provider.id}
                provider={provider}
                connected={connectedProviders.has(provider.id)}
                onConnect={() => handleConnect(provider.id)}
                onDisconnect={() => setDisconnectTarget(provider.id)}
                disabled={!canDisconnect(provider.id)}
              />
            ))}
          </SettingsCard>
        </div>

        {/* ── 表示設定 ── */}
        <div>
          <SectionHeader title="表示設定" />
          <SettingsCard>
            {/* 1ページの表示件数 */}
            <SettingsRow
              icon={<LayoutGrid size={18} />}
              label="1ページの表示件数"
              trailing={
                <select
                  value={perPage}
                  onChange={(e) =>
                    setPerPage(Number(e.target.value) as PerPage)
                  }
                  className="bg-[#1a2e2e] border border-[#1e3333] text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#00d4d4] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}件
                    </option>
                  ))}
                </select>
              }
            />
          </SettingsCard>
        </div>

        {/* ── その他 ── */}
        <div>
          <SectionHeader title="その他" />
          <SettingsCard>
            <SettingsRow
              icon={<LogOut size={18} />}
              label="ログアウト"
              onClick={() => setModal("logout")}
            />

            <SettingsRow
              icon={<Trash2 size={18} />}
              label="アカウントを削除"
              onClick={() => setModal("deleteAccount")}
              danger
            />
          </SettingsCard>
        </div>

        {/* アプリバージョン */}
        <p className="text-center text-xs text-gray-700 mt-2">
          MuseLog💋 v0.1.0
        </p>
      </div>

      {/* ── モーダル群 ── */}
      <EmailEditModal
        open={modal === "email"}
        currentEmail={currentEmail}
        onClose={close}
        onSave={handleEmailSave}
      />

      <PasswordEditModal
        open={modal === "password"}
        onClose={close}
        onSave={handlePasswordSave}
      />

      <DeleteAccountModal
        open={modal === "deleteAccount"}
        onClose={close}
        onConfirm={handleDeleteAccount}
      />

      {/* ログアウト確認 */}
      <DeleteConfirmDialog
        open={modal === "logout"}
        onCancel={close}
        onConfirm={handleLogout}
        title="ログアウト"
        description="ログアウトしますか？"
        confirmLabel="ログアウト"
        confirmClassName="bg-[#00d4d4] hover:bg-[#00bfbf] text-[#0a1a1a]"
      />

      {/* OAuth 連携解除確認 */}
      <DeleteConfirmDialog
        open={disconnectTarget !== null}
        onCancel={() => setDisconnectTarget(null)}
        onConfirm={handleDisconnectConfirm}
        title={`${OAUTH_PROVIDERS.find((p) => p.id === disconnectTarget)?.name ?? ""} 連携を解除`}
        description="この連携を解除しますか？再度連携することは可能です。"
        confirmLabel="解除する"
        confirmClassName="text-white bg-red-700/80 hover:bg-red-700"
      />
    </div>
  );
}
