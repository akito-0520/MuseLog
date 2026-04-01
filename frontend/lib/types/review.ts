export interface FavoriteVideo {
  title: string;
  url: string;
}

export interface Actress {
  id: number;
  name: string;
  image_url: string | null;
  fanza_url: string;
  height: number | null;
  bust: number | null;
  waist: number | null;
  hips: number | null;
  cup: string | null;
}

export interface Review {
  id: number;
  actress: Actress;
  rating: number;
  tags: string[];
  memo: string | null;
  favorite_videos: FavoriteVideo[];
  created_at: string;
  updated_at: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  per_page: number;
}
