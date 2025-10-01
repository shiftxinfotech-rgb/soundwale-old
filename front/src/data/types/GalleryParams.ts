export type GalleryResponse = {
  status?: boolean;
  data?: GalleryData;
};

export type GalleryData = {
  business_shop_images_data: BusinessShopImage[];
  business_shop_video_data: BusinessVideo[];
};
export type BusinessShopImage = {
  id: number;
  user_id: number;
  business_id: any;
  image: string;
  created_at: string;
  updated_at: string;
  image_url: string;
};
export type BusinessVideo = {
  id: number;
  user_id: number;
  video: string;
  status: number;
  created_at: string;
  updated_at: string;
  video_url: string;
};

export type GalleryDetailParams = {
  images: string[];
  video: string;
  type: string;
  index: number;
};
