import { UserProfile } from '@shared/models/user-profile.interface';

export interface UserProfileVm extends Omit<UserProfile, 'name'> {
  isVisible: boolean;
  name: string,
  lastName: string
}
