export interface IAPI1RequestData {
  artist_surname: string | undefined;
  artist_firstname: string | undefined;
  title: string | undefined;
  year: number | string | undefined;
  object_id: string | undefined;
}

export interface IAPIResponseData {
  artist_surname: string;
  artist_firstname: string;
  title: string;
  year: number;
  object_id: string;
}
[];
