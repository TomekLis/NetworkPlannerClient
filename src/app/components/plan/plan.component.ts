import { Component, OnInit } from '@angular/core';
import { PlannerService } from 'src/app/services/planner.service';
import { Plan } from 'src/app/models/plan';
import { Cell } from 'src/app/models/cell';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LatLng } from '@agm/core';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  savePlanForm: FormGroup;
  plan: Plan = {
    name: '',
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
  verticesAsPath: LatLng[] = [];

  selectedCell: {
    latitude: number;
    longitude: number;
  };
  constructor(
    private plannerService: PlannerService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.savePlanForm = formBuilder.group({
      planTitle: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.plannerService.currentPlan.subscribe(data => (this.plan = data));
    this.plan.grid.cells.forEach(element => {
      element.vertexPaths = element.vertices.map(v => v.latLng);
    });
  }

  click(cell: Cell) {
    this.selectedCell = {
      longitude: (cell.center as any).lat,
      latitude: (cell.center as any).lng
    };
  }

  async savePlan() {
    await this.plannerService.savePlanInDb(
      this.savePlanForm.controls.planTitle.value
    );
    this.router.navigate(['/plan-list']);
  }
}
