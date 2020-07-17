import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../services/cinema/cinema.service';
@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public cinemas;
  public salles;
  public currenCity;
  public currentCinema;
  public currentProjection;
  public selectedTickets;
  constructor(public cinemaService: CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data
      }, error => {
        console.log("Can't fetch cities from API")
      })
  }

  /**
   * Get all cinemas of a given City
   * @param v
   */
  public getCinemas(v) {
    this.currenCity=v;
    this.cinemaService.getCinemas(v)
     .subscribe(data => {
       this.cinemas = data
     }, error => {
       console.log("Can't fetch cinemas of this city")
     })
  }

  onGetSalles(c) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(s => {
          this.cinemaService.getProjections(s)
            .subscribe(data => {
              s.projections = data
            }, error => {
              console.log("Can't fetch projections of this room")
            })
        })
      }, error => {
        console.log("Can't fetch cinemas of this city")
      })
  }

  onGetTicketsPlaces(s) {
    this.currentProjection=s;
    this.cinemaService.getTicketsPlaces(s)
      .subscribe(data => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];
      }, error => {
        console.log("Can't fetch projections of this room")
      })
  }

  onSelectTicket(t) {
    if(!t.selected){
      t.selected = true;
      this.selectedTickets.push(t);
    }else{
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
  }

  // Get bootstrap class based on Ticket Status (selected, reserved or not )
  getTicketClass(t) {
    let classValue="btn btn-sm mr-2 mb-2 ";
    if(t.reserve==true) {
      classValue +="btn-danger"
    } else if(t.selected==true) {
      classValue +="btn-warning"
    } else {
      classValue +="btn-success"
    }

    return classValue;
  }

  // Pay selected tickets
  onPayTicket(form) {
      let tickets = [];
      this.selectedTickets.forEach(t => {
        tickets.push(t.id)
      });
      form.tickets = tickets;
      this.cinemaService.payTickets(form)
        .subscribe(data =>  {
          alert("Les tickets sont bien réservés !");
          this.onGetTicketsPlaces(this.currentProjection)
        }, err => {
          alert("Oops le paiement n'est pas bien effectué")
        })
  }
}
