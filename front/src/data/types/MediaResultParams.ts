export type MediaResultParams = {
  uri?: string | null;
  mime?: string | null;
  path?: string | null;
  pickType: string | null;
};

export type MediaBodyResponse = {
  uri?: string | null;
  type?: string | null;
  name?: string | null;
};
