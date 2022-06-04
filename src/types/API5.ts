export interface API5Request {
  id_object: string;
  object_image: string;
  methods: { methods1: string; methods2: string };
}

export interface API5Response {
  object_ver_success: boolean;
}
