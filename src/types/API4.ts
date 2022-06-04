export interface IAPI4Request {
  id_object: string;
  methods: { methods1: string; methods2: string };
}

export interface IAPI4Response {
  add_method_success: boolean;
}
