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
  // plan: Plan = {
  //   name: '',
  //   channelReuseDistance: 0,
  //   cirf: 0,
  //   requiredTransmissionQuality: 0,
  //   systemCapacity: 0,
  //   antennaGain: 0,
  //   cableLoss: 0,
  //   cellRange: 0,
  //   channelMax: 0,
  //   channelMin: 0,
  //   eirp: 0,
  //   clusterSize: 0,
  //   channelReuseDistnace: 0,
  //   grid: {
  //     cells: []
  //   },
  //   latitude: 0,
  //   longitude: 0,
  //   requiredCi: 0,
  //   transmitterPower: 0
  // };
  $plan: Promise<Plan>;
  constructor(
    private plannerService: PlannerService,
    private route: ActivatedRoute
  ) {}
  selectedCell: {
    latitude: number;
    longitude: number;
  };

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.$plan = this.plannerService.getPlanById(this.id);
  }
  click(cell: Cell) {
    this.selectedCell = {
      longitude: (cell.center as any).lat,
      latitude: (cell.center as any).lng
    };
  }
}
