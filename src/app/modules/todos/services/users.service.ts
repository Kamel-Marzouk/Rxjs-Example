import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpService) {}

  members = toSignal(this.http.getAll('/users'), {
    initialValue: [],
  });

  getCurrentMember(id: number): User | undefined {
    return this.members().find((member) => member.id === id);
  }
}
