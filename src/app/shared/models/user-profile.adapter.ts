import { UserProfile } from '@shared/models/user-profile.interface';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';

export const userProfileAdapter = (userProfiles: UserProfile[]): UserProfileVm[] => {
  return userProfiles.map((user: UserProfile) => {
    const userProfileVm: UserProfileVm = {
      isActive: user.isActive ? user.isActive : false,
      balance: user.balance ? user.balance : '',
      picture: user.picture ? user.picture : '',
      age: user.age ? user.age : 0,
      name: user.name?.first ? user.name?.first : '',
      lastName: user.name?.last ? user.name?.last : '',
      company: user.company ? user.company : '',
      email: user.email ? user.email : '',
      address: user.address ? user.address : '',
      tags: user.tags.length > 0 ? user.tags : [],
      favoriteFruit: user.favoriteFruit ? user.favoriteFruit : '',
      _id: user._id ? user._id : '',
      isVisible: true,
    };
    return userProfileVm;
  });
};
