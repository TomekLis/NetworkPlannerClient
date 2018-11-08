import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material';
import {
  systemSpecification,
  transmissionTypes,
  AreaTypes,
  PolygonCharacteristics
} from 'src/app/utils/systems-specification';
import { PlannerService } from 'src/app/services/planner.service';
import { Router } from '@angular/router';
import { CellType } from 'src/app/models/cell';

@Component({
  selector: 'initial-step',
  templateUrl: './initial-step.component.html',
  styleUrls: ['./initial-step.component.css']
})
export class InitialStepComponent implements OnInit {
  initialForm: FormGroup;

  systemTypes = [
    { name: 'GSM-900', value: 900 },
    { name: 'GSM-1800', value: 1800 }
  ];

  currentSystem = this.systemTypes[0].value;

  currentSpecification = systemSpecification[this.currentSystem];

  transmissionTypes = [
    { name: 'Voice (50% loc.)', value: transmissionTypes.voice50Loc },
    { name: 'Voice (50% + marg)', value: transmissionTypes.voice50Marg },
    { name: 'Voice (75% loc.)', value: transmissionTypes.voice75Loc },
    { name: 'Data (CS1)', value: transmissionTypes.DataCS1 },
    { name: 'Data (CS2)', value: transmissionTypes.DataCS2 },
    { name: 'Data (CS3)', value: transmissionTypes.DataCS3 },
    { name: 'Data (CS4)', value: transmissionTypes.DataCS4 }
  ];

  areaTypes = [
    { name: 'Large city', value: AreaTypes.LargeCity },
    { name: 'Small city', value: AreaTypes.SmallCity },
    { name: 'Open space/lural area', value: AreaTypes.RularArea }
  ];

  receiverTypes = [
    { name: 'Stationary', value: PolygonCharacteristics.Square },
    { name: 'Mobile', value: PolygonCharacteristics.Hexagonal }
  ];

  minTransPow = 1;
  maxTransPow = 39;
  minCableLoss = 0;
  maxCableLoss = 1.5;
  minAntennaGain = 1;
  maxAntennaGain = 5;
  minAntennaHeight = 10;
  maxAntennaHeight = 80;

  constructor(
    private formBuilder: FormBuilder,
    private plannerService: PlannerService,
    private router: Router
  ) {
    this.initialForm = formBuilder.group({
      systemType: [this.currentSystem, [Validators.required]],
      frequency: [900, this.getFrequencyValidators()],
      transsmissionType: [transmissionTypes.voice50Loc, [Validators.required]],
      channelMin: [12, this.getChannelValidators()],
      channelMax: [100, this.getChannelValidators()],
      areaType: [AreaTypes.LargeCity, [Validators.required]],
      transmitterPower: [
        30,
        [
          Validators.required,
          Validators.min(this.minTransPow),
          Validators.max(this.maxTransPow)
        ]
      ],
      cableLoss: [
        1,
        [
          Validators.required,
          Validators.min(this.minCableLoss),
          Validators.max(this.maxCableLoss)
        ]
      ],
      antennaGain: [
        3,
        [
          Validators.required,
          Validators.min(this.minAntennaGain),
          Validators.max(this.maxAntennaGain)
        ]
      ],
      transmitterHeight: [
        30,
        [
          Validators.required,
          Validators.min(this.minAntennaHeight),
          Validators.max(this.maxAntennaHeight)
        ]
      ],
      receiverType: [PolygonCharacteristics.Hexagonal, [Validators.required]]
    });
  }

  async ngOnInit() {}

  radioChange(event: MatRadioChange) {
    this.currentSpecification = systemSpecification[event.value];
    this.initialForm.controls.frequency.setValue(null);
    this.initialForm.controls.frequency.setValidators(
      this.getFrequencyValidators()
    );

    this.initialForm.controls.channelMin.setValue(null);
    this.initialForm.controls.channelMin.setValidators(
      this.getChannelValidators()
    );

    this.initialForm.controls.channelMax.setValue(null);
    this.initialForm.controls.channelMax.setValidators(
      this.getChannelValidators()
    );
  }

  private getFrequencyValidators() {
    return [
      Validators.required,
      Validators.min(this.currentSpecification.frequency.min),
      Validators.max(this.currentSpecification.frequency.max)
    ];
  }

  getChannelValidators() {
    return [
      Validators.required,
      Validators.min(this.currentSpecification.channels.min),
      Validators.max(this.currentSpecification.channels.max)
    ];
  }

  onFormSubmit(form) {
    if (form.invalid) {
      return;
    }
    this.plannerService.saveInitialStepData(form);
    this.router.navigate(['/area-selection-step']);
  }
}
