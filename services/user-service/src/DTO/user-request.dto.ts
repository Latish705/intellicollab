export interface RegisterUserDto {
  name: string;
  email: string;
  firebaseId: string;
  phone: number;
}

export interface LoginUserDto {
  firebaseId: string;
}
