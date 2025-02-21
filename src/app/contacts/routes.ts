import { Routes } from '@angular/router';
import { ListComponent } from './listContact/list.component';
import { EditFormComponent } from './forms/editForm/edit-form.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ListComponent,
  },
];
