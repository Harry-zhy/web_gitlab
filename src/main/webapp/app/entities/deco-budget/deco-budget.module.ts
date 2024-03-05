import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DecoBudgetComponent } from './list/deco-budget.component';
import { DecoBudgetDetailComponent } from './detail/deco-budget-detail.component';
import { DecoBudgetUpdateComponent } from './update/deco-budget-update.component';
import { DecoBudgetDeleteDialogComponent } from './delete/deco-budget-delete-dialog.component';
import { DecoBudgetRoutingModule } from './route/deco-budget-routing.module';

@NgModule({
  imports: [SharedModule, DecoBudgetRoutingModule],
  declarations: [DecoBudgetComponent, DecoBudgetDetailComponent, DecoBudgetUpdateComponent, DecoBudgetDeleteDialogComponent],
})
export class DecoBudgetModule {}
