import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { SportService } from '../../shared/services/cortex.core.sportService';
import { Sport } from '../../shared/services/cortex.core.sportServiceProxy';

@Component({
    selector: 'cortex-sport-create',
    templateUrl: './sport-create.component.html',
    styleUrls: [
        './sport-create.component.scss'
    ],
    providers: [
        SportService
    ]
})
export class SportcreateComponent implements OnInit, AfterViewInit {
    entity: Sport;

    constructor(private service: SportService, private location: Location) {

    }

    ngOnInit() {
        this.entity = new Sport();
    }

    create() {
        this.service.sportCreateEntity(this.entity).subscribe(s => {
            this.location.back();
        });
    }

    ngAfterViewInit() {

    }
}
