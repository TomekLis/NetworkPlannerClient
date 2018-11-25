import { Component, OnInit } from '@angular/core';
import { PlannerService } from 'src/app/services/planner.service';
import { Plan } from 'src/app/models/plan';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {
  plans: Plan[];

  constructor(private plannerService: PlannerService) {}

  async ngOnInit() {
    this.plans = await this.plannerService.getPlans();
  }
}
