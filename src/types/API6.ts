export interface IAPI6Request {
  id_object: string;
}

export interface IAPI6Response {
  [id_object: string]: {
    owner_id: string;
    date: string;
    action: string;
    verification_methods: { method1: string; method2: string };
  };
}
