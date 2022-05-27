export interface IAPI3Request {
  artist_surname: string;
  artist_firstname: string;
  title: string;
  year: number;
  artist_id: string;
  owner_id: string;
  object_image: string;
  methods: { method1: string; method2: string };
}

export interface IAPI3Response {
  add_object_success: boolean;
}
