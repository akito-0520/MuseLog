/**
 * DMM API から返却される女優情報
 * （DB 保存前の検索結果。保存済み女優は lib/types/review.ts の Actress を使用）
 */
export interface DmmActress {
  id: string;
  name: string;
  ruby: string | null;
  image_url: string | null;
  fanza_url: string;
  height: number | null;
  bust: number | null;
  waist: number | null;
  hips: number | null;
  cup: string | null;
}
