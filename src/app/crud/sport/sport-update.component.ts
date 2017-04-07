import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { SportService } from '../../shared/services/cortex.core.sportService';
import { Sport } from '../../shared/services/cortex.core.sportServiceProxy';

@Component({
    selector: 'cortex-sport-update',
    templateUrl: './sport-update.component.html',
    styleUrls: [
        './sport-update.component.scss'
    ],
    providers: [
        SportService
    ]
})
export class SportupdateComponent implements OnInit, AfterViewInit {
    id: string;
    entity: Sport;

    constructor(private service: SportService, private location: Location, private route: ActivatedRoute) {
      this.entity = new Sport();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.loadEntity();
        });
    }

    ngAfterViewInit() {

    }

    private loadEntity() {
        this.service.getSport<Sport>(this.id).subscribe(e => {
            this.entity = e;
        });
    }

    update() {
        this.service.sportUpdateEntity(this.entity).subscribe(s => {
            this.location.back();
        });
    }

    cancel() {
        this.loadEntity();
    }
}
