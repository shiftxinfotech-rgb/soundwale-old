export type CataloguesInputFormParam = {
  image: string;
  name: string;
  other_details?: string;
  image_file?: string;
};

export type CataloguesResponse = {
  status: string;
  message: string;
};

export type AddCataloguesParams = {
  userId?: number;
};
