export interface IAPI6Request {
  object_id: string;
}

export interface IAPI6Response {
  [object_id: string]: {
    owner_id: string;
    date: string;
    action: string;
    verification_methods: { method1: string; method2: string };
  };
}
