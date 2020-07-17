import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {

  // Api Link
  public host:string='http://localhost:8181';

  constructor(private _http:HttpClient) { }

  // Get all cities
  getVilles() {
    return this._http.get(this.host+"/villes");
  }

  // Get all cinemas of a given City
  getCinemas(v) {
    return this._http.get(v._links.cinemas.href)
  }

  // Get All Rooms of a given Cinema
  getSalles(c) {
    return this._http.get(c._links.salles.href)
  }

  // Get all Projections of a given Room
  getProjections(s) {
    let url = s._links.projections.href.replace("{?projection}","")+"/?projection=p1";
    return this._http.get(url)
  }

  // Get all places of a projection
  getTicketsPlaces(p) {
    let url = p._links.tickets.href.replace("{?projection}","")+"/?projection=TicketProj";
    return this._http.get(url)
  }

  payTickets(form) {
    return this._http.post(this.host+"/payerTickets", form);
  }
}
