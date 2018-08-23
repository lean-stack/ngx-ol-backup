import {Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';

import OlMap from 'ol/Map';
import { default as OlXYZ } from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import { Tile as OlTileLayer, Vector as OlVectorLayer } from 'ol/layer';

import OlView from 'ol/View';
import OlSelect from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import OlVectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {

  selectedCountry: string;

  @Output()
  countrySelected = new EventEmitter<string>();


  @Input()
  public lat: number;
  @Input()
  public lng: number;

  
  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log(click);
    this.source = new OlXYZ({
      // Tiles from Mapbox (Light)
      url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    });

    this.layer = new OlTileLayer({
      source: new OSM
    });

    this.view = new OlView({
      projection: 'EPSG:4326',
      center: [this.lng,this.lat],
      zoom: 12
    });

    const vector = new OlVectorLayer({
      source: new OlVectorSource({
        url: '/assets/DEU.geo.json',
        format: new GeoJSON()
      })
    });

    this.map = new OlMap({
      target: 'map',
      layers: [vector, this.layer],
      view: this.view
    });

    const select = new OlSelect({
      condition: click
    });

    this.map.addInteraction(select);
    select.on('select', (e: any) => {
      if (e.selected.length > 0) {
        this.selectedCountry = e.selected[0].values_.name;
        this.countrySelected.emit(e.selected[0].values_.name);
        this.cdRef.detectChanges();
      }
      console.log(e.mapBrowserEvent.coordinate);
    });
  }
}
