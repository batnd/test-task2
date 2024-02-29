import { Injectable } from '@angular/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import data from '../../../assets/data/data';
import { userProfileAdapter } from '@shared/models/user-profile.adapter';
import { UserProfile } from '@shared/models/user-profile.interface';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public get<T>(): Observable<T> {
    // const randomDelay: number = Math.floor(Math.random() * 1000) + 2000;

    return timer(100)
      .pipe(
        switchMap(() => {
          const usersProfilesDtoToVm: UserProfileVm[] = userProfileAdapter(data as UserProfile[]);
          return of(usersProfilesDtoToVm as T)
        })
      );
  }
}
