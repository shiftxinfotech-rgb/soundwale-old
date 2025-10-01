import {ProductBean} from './ProductParam';

export type DashboardResponse = {
  status?: boolean;
  data?: DashboardData;
};

export type DashboardData = {
  home_slider_data?: SliderDatum[];
  look_who_s_trending_data?: TopPicksData[];
  our_top_pick_data?: TopPicksData[];
  footer_slider_data?: SliderDatum[];
  recent_requirements_data?: ProductBean[];
};

export type SliderDatum = {
  id?: number;
  image?: string;
  status?: number;
  image_url?: string;
};

export type TopPicksData = {
  id?: number;
  image?: string;
  name?: string;
  description?: string;
  image_url?: string;
};
