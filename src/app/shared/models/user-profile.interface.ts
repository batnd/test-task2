export interface UserProfile {
  isActive: boolean,
  balance: string,
  picture: string,
  age: number,
  name: {
    first: string,
    last: string
  },
  company: string,
  email: string,
  address: string,
  tags: string[],
  favoriteFruit: string,
  _id: string
}
