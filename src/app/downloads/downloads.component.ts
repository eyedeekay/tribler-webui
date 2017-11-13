import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { FileSizePipe } from '../file-size.pipe';
import { TriblerService } from '../shared/tribler.service';

@Component({
    selector: 'downloads',
    templateUrl: './downloads.component.html',
    styleUrls: ['./downloads.component.css'],
    host: { 'class': 'd-flex flex-column flex-grow' }
})
export class DownloadsComponent implements OnInit {
    downloads = [];
    selected = [];

    constructor(private _triblerService: TriblerService) {
    }

    ngOnInit() {
        return Observable
            .interval(2000)
            .startWith(0)
            .flatMap(() => {
                return this._triblerService.getDownloads();
            }).subscribe(downloads => {
                this.downloads = downloads;

                var selected = this.selected[0];
                if (selected !== undefined) {
                    var self = this;
                    this.selected[0] = undefined;
                    this.downloads.forEach(function (value, index) {
                        if (value && selected.infohash === value.infohash) {
                            value.files.sort(function (a: any, b: any) {
                                var x = a.name.toLowerCase();
                                var y = b.name.toLowerCase();
                                return x < y ? -1 : x > y ? 1 : 0;
                            });
                            self.selected[0] = value;
                        }
                    });
                }
            });
    }

    onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);
    }

    onActivate(event) {
        console.log('Activate Event', event);
    }
}
