import { Component, OnInit } from '@angular/core';
import { PlannerService } from 'src/app/services/planner.service';
import { Plan } from 'src/app/models/plan';
import { ActivatedRoute } from '@angular/router';
import { Cell } from 'src/app/models/cell';
import { LatLng } from '@agm/core';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.css']
})
export class PlanDetailsComponent implements OnInit {
  id: string;
  $plan: Promise<Plan>;
  isRequesting: boolean;
  constructor(
    private plannerService: PlannerService,
    private route: ActivatedRoute
  ) {
    this.isRequesting = true;
  }
  selectedCell: {
    latitude: number;
    longitude: number;
  };

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.$plan = this.plannerService.getPlanById(this.id);
    this.isRequesting = false;
  }
  click(cell: Cell) {
    this.selectedCell = {
      longitude: (cell.center as any).lat,
      latitude: (cell.center as any).lng
    };
  }
}
