export interface User {
  uid: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  className?: string;
  emailVerified?: boolean;
  isAdmin?: boolean;
  expireDt?: Date;
  roles: Roles;
}
export interface Roles {
  student?: boolean;
  teacher?: boolean;
  admin?: boolean;
}
