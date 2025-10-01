export type GenericResponse = {
  status: boolean;
  message: string;
};
export type Meta = {
  current_page?: number;
  per_page?: string;
  next_page_url?: null;
  have_more_records?: boolean;
  total?: number;
};

export type PaginationParams = {
  page: number;
  limit: number;
  [key: string]: any;
};

export type FavTypes = 'buyer' | 'seller';

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};
