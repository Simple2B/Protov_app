export interface IAPI1RequestData {
  search_item: string;
  artist_surname: string | undefined;
  artist_firstname: string | undefined;
  artist_id: string,
  title: string | undefined;
  year: number | string | undefined;
  id_object: string | undefined;
}

export interface IAPIResponseData {
  artist_surname: string;
  artist_firstname: string;
  title: string;
  year: number;
  id_object: string;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
}[];
