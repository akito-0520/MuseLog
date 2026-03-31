import { z } from "zod";

export const reviewEditSchema = z.object({
  rating: z.number().min(1, "評価を選択してください").max(5),
  tags: z.array(z.string()).max(5, "タグは最大5個まで選択できます"),
  memo: z.string().max(500, "メモは500文字以内で入力してください"),
  favorite_videos: z.array(
    z.object({
      title: z.string().min(1, "タイトルを入力してください"),
      url: z.url("有効なURLを入力してください"),
    })
  ),
});

export type ReviewEditFormValues = z.infer<typeof reviewEditSchema>;
