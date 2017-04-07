import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SportService } from '../../shared/services/cortex.core.sportService';
import { Sport } from '../../shared/services/cortex.core.sportServiceProxy';

@Component({
    selector: 'cortex-sport-delete',
    templateUrl: './sport-delete.component.html',
    styleUrls: [
        './sport-delete.component.scss'
    ],
    providers: [
        SportService
    ]
})
export class SportdeleteComponent implements OnInit, AfterViewInit {
    id: string;
    entity: Sport;
    private sub: any;

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

    delete() {
        this.service.sportDeleteEntity(this.entity).subscribe(s => {
            this.location.back();
        });
    }

    cancel() {
        this.location.back();
    }
}
