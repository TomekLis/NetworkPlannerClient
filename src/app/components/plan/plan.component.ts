import { Component, OnInit } from '@angular/core';
import { PlannerService } from 'src/app/services/planner.service';
import { Plan } from 'src/app/models/plan';
import { Cell } from 'src/app/models/cell';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  plan: Plan = {
    channelReuseDistance: 0,
    cirf: 0,
    requiredTransmissionQuality: 0,
    systemCapacity: 0,
    antennaGain: 0,
    cableLoss: 0,
    cellRange: 0,
    channelMax: 0,
    channelMin: 0,
    eirp: 0,
    clusterSize: 0,
    channelReuseDistnace: 0,
    grid: {
      cells: []
    },
    latitude: 0,
    longitude: 0,
    requiredCi: 0,
    transmitterPower: 0
  };

  selectedCell: {
    latitude: number;
    longitude: number;
  };
  constructor(private plannerService: PlannerService) {}

  ngOnInit() {
    this.plannerService.currentPlan.subscribe(data => (this.plan = data));
    console.log(this.plan);
  }

  click(cell: Cell) {
    this.selectedCell = {
      longitude: (cell.center as any).lat,
      latitude: (cell.center as any).lng
    };
  }
}
