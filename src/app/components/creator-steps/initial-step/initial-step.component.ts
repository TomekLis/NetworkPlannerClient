import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'initial-step',
  templateUrl: './initial-step.component.html',
  styleUrls: ['./initial-step.component.css']
})
export class InitialStepComponent implements OnInit {
  initialForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.initialForm = formBuilder.group({
      frequency: [
        null,
        [Validators.required, Validators.min(100), Validators.max(1500)]
      ]
    });
  }

  async ngOnInit() {}

  onFormSubmit(
    // form:NgForm
    form
  ) {
    console.log(form);
  }
}
