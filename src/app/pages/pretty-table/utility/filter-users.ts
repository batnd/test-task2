import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';

export const filterUsers = (users: UserProfileVm[], filters: { [key: string]: string }, tags: string[]): UserProfileVm[] => {
  return users.filter((user: UserProfileVm) => {
    const isFiltered: boolean = Object.keys(filters).every((key: string) => {
      if (!filters[key]) return true;
      if (!user[key as keyof typeof user]) return false;
      return user[key as keyof typeof user].toString().toLowerCase().includes(filters[key].toLowerCase());
    });

    const isTagged: boolean = tags.length === 0 || tags.every((tag: string) => user.tags.includes(tag));

    return isFiltered && isTagged;
  });
};
