import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',       redirectTo:   'home',   pathMatch: 'full' },
  { path: 'home',   loadChildren: './pages/home/home.module#HomePageModule'       },
  { path: 'login',  loadChildren: './pages/login/login.module#LoginPageModule'    },
  { path: 'tabs',   loadChildren: './pages/tabs/tabs.module#TabsPageModule'       },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
