export interface IAPI7Request {
  id_object: string;
  new_owner_id: string;
  methods: { methods1: string; methods2: string };
}

export interface IAPI7Response {
  sale_success: boolean;
}
