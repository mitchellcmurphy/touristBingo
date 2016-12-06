import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { SquaresComponent } from './squares';
import { CreationToolComponent } from './creation-tool';
import { ImgModalWindow } from './modal-img/modal-img';
import { LoginComponent } from './login';
import { AuthGuard } from './common/auth.guard'

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'squares', component: SquaresComponent, canActivate: [AuthGuard] },
  { path: 'creation-tool', component: CreationToolComponent, canActivate: [AuthGuard] },
  // { path: 'squares', component: SquaresComponent },
  // { path: 'creation-tool', component: CreationToolComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'detail', loadChildren: () => System.import('./+detail').then((comp: any) => {
      return comp.default;
    })
    ,
  },
  { path: '**',    component: NoContentComponent },
];
