export interface IAPI7Request {
  object_id: string;
  new_owner_id: string;
  methods: { method1: string; method2: string };
}

export interface IAPI7Response {
  sale_success: boolean;
}
