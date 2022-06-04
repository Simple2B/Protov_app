export interface IAPI2Request {
  id_object: string;
  owner_password: string;
}

export interface IAPI2Response {
  artist_surname: string;
  artist_firstname: string;
  title: string;
  year: number;
  id_object: string;
  owner_ver_status: boolean;
}
