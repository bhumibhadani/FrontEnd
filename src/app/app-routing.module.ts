import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CarModelFormComponent } from "src/app/components/car-model-form/car-model-form.component";
import { CarModelListComponent } from "src/app/components/car-model-list/car-model-list.component";

const routes: Routes = [
  { path: '', redirectTo: 'CarSystemList', pathMatch: 'full' },
  { path: 'CarSystemList',component: CarModelListComponent },
  { path: 'AddCarSystem', component: CarModelFormComponent },
  // { path: '', redirectTo: 'models', pathMatch: 'full' },
  // { path: 'models', component: CarModelListComponent },
  // { path: 'models/new', component: CarModelFormComponent },
  // { path: 'models/edit/:id', component: CarModelFormComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
