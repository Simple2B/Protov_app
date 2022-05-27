export interface IAPI7Request {
  id_object: string;
  new_owner_id: string;
  methods: { method1: string; method2: string };
}

export interface IAPI7Response {
  sale_success: boolean;
}
