import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from '../utils/config.service';
import { Http, Headers } from '@angular/http';
import { BaseService } from './base.service';
import { AreaTypes } from '../utils/systems-specification';
import { GridGeneratorService } from './grid-generator.service';
import { PolygonService } from './polygon.service';
import { AgmPolygon, LatLng } from '@agm/core';
import { Plan } from '../models/plan';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PlannerService extends BaseService {
  private initialStepData = new BehaviorSubject({});

  currentInitialStepData = this.initialStepData.asObservable();

  private initialPlan = new BehaviorSubject({
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
    grid: {
      cells: []
    },
    latitude: 0,
    longitude: 0,
    requiredCi: 0,
    channelReuseDistnace: 0,
    transmitterPower: 0
  });
  currentPlan = this.initialPlan.asObservable();
  baseUrl = '';

  constructor(
    private http: Http,
    private configService: ConfigService,
    private gridGeneratorService: GridGeneratorService,
    private polygonService: PolygonService,
    private router: Router
  ) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  saveInitialStepData(data) {
    this.initialStepData.next(data);
  }

  savePlan(data) {
    this.initialPlan.next(data);
  }

  async generatePlan(data, agmPolygon: AgmPolygon, latitude, longitude) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const cellRadius =
      (await this.calculateCellRange(headers, {
        transmitterHeight: data.transmitterHeight,
        frequency: data.frequency,
        antennaGain: data.antennaGain,
        areaType: data.areaType,
        cableLoss: data.cableLoss,
        transmitterPower: data.transmitterPower
      })) * 1000;

    console.log(cellRadius);
    const polygonCoords = await this.polygonService.getPolygonPoints(
      agmPolygon
    );

    const grid = await this.gridGeneratorService.GenerateGrid(
      data.receiverType,
      polygonCoords,
      cellRadius
    );
    const plan = await this.getPlanFromApi(
      headers,
      grid,
      cellRadius,
      latitude,
      longitude,
      data
    );
    this.savePlan(plan);
  }

  private async getPlanFromApi(
    headers,
    grid,
    cellRadius,
    longitude,
    latitude,
    data
  ) {
    let plan: Plan = {
      name: '',
      grid: grid,
      cirf: 0,
      cellRange: cellRadius,
      channelReuseDistnace: 0,
      channelReuseDistance: 0,
      eirp: 0,
      requiredCi: data.transsmissionType.requiredCi,
      requiredTransmissionQuality: data.transsmissionType.requiredCi,
      systemCapacity: 0,
      longitude: longitude,
      latitude: latitude,
      antennaGain: data.antennaGain,
      cableLoss: data.cableLoss,
      transmitterPower: data.transmitterPower,
      channelMax: data.channelMax,
      channelMin: data.channelMin,
      clusterSize: 0
    };

    const response = await this.http
      .post(this.baseUrl + '/planner/generatePlan', plan, headers)
      .toPromise();
    plan = JSON.parse((response as any)._body);

    return plan;
  }
  private async calculateCellRange(
    headers,
    cellRangeData: {
      transmitterHeight: number;
      frequency: number;
      transmitterPower: number;
      antennaGain: number;
      cableLoss: number;
      areaType: AreaTypes;
    }
  ) {
    let cellRadius = 0;

    const response = await this.http
      .post(
        this.baseUrl + '/planner/calculateCellRadius',
        cellRangeData,
        headers
      )
      .toPromise();
    cellRadius = Number((response as any)._body);
    return cellRadius;
  }

  async getPlans() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const authToken = localStorage.getItem('auth_token');
    headers.append('Authorization', `Bearer ${authToken}`);

    const response = await this.http
      .get(this.baseUrl + '/planner/getPlans', { headers })
      .toPromise();
    const plans = JSON.parse((response as any)._body) as Plan[];
    return plans;
  }

  async getPlanById(id: string) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const authToken = localStorage.getItem('auth_token');
    headers.append('Authorization', `Bearer ${authToken}`);

    const response = await this.http
      .get(this.baseUrl + '/planner/getPlan/' + id, { headers })
      .toPromise();
    const plan = JSON.parse((response as any)._body) as Plan;
    plan.grid.cells.forEach(element => {
      element.vertexPaths = element.vertices.map(v => v.latLng);
    });
    return plan;
  }

  async savePlanInDb(title: String) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const authToken = localStorage.getItem('auth_token');
    headers.append('Authorization', `Bearer ${authToken}`);

    let planData;
    this.currentPlan.subscribe(data => {
      planData = data;
    });

    planData.name = title;
    const response = await this.http
      .post(this.baseUrl + '/planner/savePlan', planData, { headers })
      .toPromise();
    // console.log(response);
    return response;
  }
}
