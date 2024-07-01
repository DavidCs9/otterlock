export interface Password {
  _id: string;
  userId: string;
  site: string;
  encryptedPassword: string;
  __v: number;
}

export interface CreatePasswordBody {
  site: string;
  encryptedPassword: string;
}
