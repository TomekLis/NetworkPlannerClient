import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Input
} from '@angular/core';
import { PlannerService } from 'src/app/services/planner.service';
import { MapsAPILoader, AgmPolygon, LatLng, AgmMap } from '@agm/core';
import { Point } from '@agm/core/services/google-maps-types';
import { MapsService } from 'src/app/services/maps.service';
import { PolygonService } from 'src/app/services/polygon.service';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-area-selection-step',
  templateUrl: './area-selection-step.component.html',
  styleUrls: ['./area-selection-step.component.css']
})
export class AreaSelectionStepComponent implements OnInit {
  initialStepData: any;

  latitude = 51.476852;

  longitude = -0.0005;
  infoWindowLat: number;
  infoWindowLng: number;
  areaSize = 0;
  zoom = 9;
  autocomplete: any;
  isPlaceSelected = false;

  isRequesting: boolean;

  @ViewChild(AgmMap)
  private agmMap: AgmMap;

  @ViewChild('search')
  searchElementRef: ElementRef;
  location: string;
  polygonCoords: Point[] = [];

  @ViewChild(AgmPolygon)
  private agmPolygon: AgmPolygon;

  constructor(
    private ngZone: NgZone,
    private plannerService: PlannerService,
    private mapsAPILoader: MapsAPILoader,
    private mapsService: MapsService,
    private polygonService: PolygonService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.plannerService.currentInitialStepData.subscribe(
      data => (this.initialStepData = data)
    );

    await this.mapsAPILoader.load();
    this.initAutocomplete();
  }

  private initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement,
      {}
    );
    this.autocomplete.addListener('place_changed', () => this.onPlaceChanged());
  }

  private onPlaceChanged() {
    this.ngZone.run(() => {
      const place = this.autocomplete.getPlace();

      if (place.geometry === undefined || place.geometry === null) {
        return;
      }

      this.isPlaceSelected = true;
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.location = place.name;
      this.buildDefaultPolygon();
    });
  }

  private buildDefaultPolygon() {
    this.polygonCoords = this.mapsService.getDefaultPolygon(
      this.latitude,
      this.longitude
    );
  }

  async onConfirmSelection() {
    if (!this.initialStepData.valid) {
      this.router.navigate(['/initial-step']);
      return;
    }

    this.isRequesting = true;

    const bounds = new google.maps.LatLngBounds();
    const polygonCoords = await this.polygonService.getPolygonPoints(
      this.agmPolygon
    );

    polygonCoords.forEach(polygonCoord => {
      bounds.extend(polygonCoord);
    });

    await this.plannerService.generatePlan(
      this.initialStepData.value,
      this.agmPolygon,
      this.longitude,
      this.latitude
    );
    this.isRequesting = false;
    this.router.navigate(['/created-plan']);
    // this.grid$ = this.gridGeneratorService.GenerateGrid(
    //   this.cellTypeControl.value,
    //   polygonCoords,
    //   5000
    // );
    // this.grid$.then(x => (this.markerCoords = x.cells.map(y => y.cellCenter)));
  }
}
