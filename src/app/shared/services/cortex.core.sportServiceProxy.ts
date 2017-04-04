import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AsyncLocalStorage } from 'angular-async-local-storage';

interface VulcainResponse<T> {
  value: T;
  status: 'Success' | 'Error' | 'Pending';
  error?: {
    message: string;
    errors?: Array<{ message: string }>;
  };
}

// Models

/**
* .
*/
export class Sport {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  label: string;
  id: string;
}

/**
* .
*/
export class Game {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  awayTeamId: string;
  homeTeamId: string;
  where: string;
  seasonId: string;
  date: string;
  id: string;
  homeScore?: number;
  awayScore?: number;
  played?: boolean;
  incidents?: Incident[];
}

/**
* .
*/
export class Season {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  sportId: string;
  endDate: string;
  startDate: string;
  id: string;
  games?: Game[];
}

/**
* .
*/
export class Incident {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  /**
  * The id of the user that has reported in first the incident
  */
  createdBy: string;
  /**
  * The list of protagonist ids
  */
  protagonists: string[];
  /**
  * At what minute, the incident happened
  */
  minute: number;
  description: string;
  id: string;
}

/**
* .
*/
export class InjuryReport {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  /**
  * The id of the user that has reported in first the incident
  */
  createdBy: string;
  /**
  * The list of protagonist ids
  */
  protagonists: string[];
  /**
  * At what minute, the incident happened
  */
  minute: number;
  description: string;
  id: string;
  gameId: string;
  seasonId: string;
}

/**
* .
*/
export class Player {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  teamId: string;
  lastName: string;
  firstName: string;
  id: string;
  /**
  * The position of the player, its jersey number.
  */
  number: number;
  userId?: string;
}

/**
* .
*/
export class Coach {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  teamId: string;
  lastName: string;
  firstName: string;
  id: string;
  userId?: string;
}

/**
* .
*/
export class Team {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  sportId: string;
  id: string;
  players?: Player[];
  coach?: Coach;
}

/**
* .
*/
export class Customer {
  // tslint:disable-next-line:variable-name
  __schema?: string;
  lastName: string;
  firstName: string;
}

// Service proxy
export abstract class CortexCoreSportServiceService {
  private readonly EVENT_STORAGE = 'EVENT_STORAGE';
  private readonly STORE_STORAGE = 'STORE_STORAGE';

  constructor(protected http: Http,
    protected storage: AsyncLocalStorage,
    protected baseUrl = 'http://localhost:8080/api/',
    protected supportOffline = false) {
    Observable.merge(
      Observable.of(navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false)
    ).subscribe(isOnline => {
      if (isOnline) {
        console.log('is now online');

        this.storage.getItem(this.EVENT_STORAGE).subscribe((events: { verb: string, data: any, args?: any }[]) => {
          if (!events) {
            return;
          }

          // push saved events to service
          console.log('push saved events to service');
          events.forEach(e => this.sendAction(e.verb, e.data, e.args)
            .catch(this.handleError.bind(this))
            .subscribe(() => console.log('.')));

          // clear saved events from storage
          this.storage.removeItem(this.EVENT_STORAGE).subscribe(() => console.log(`event storage processed`));
        });
      }
    });
  }

  protected httpOptions(): RequestOptions {
    return null;
  }

  protected onUnauthenticated() { }

  protected onError(msg: string) { }

  protected sendAction<T>(verb: string, data, args?): Observable<T> {
    if (!navigator.onLine) {
      return this.delaySendAction(verb, data, args);
    } else {
      return this.http
        .post(this.resolveBackendUrl(this.baseUrl + verb, args), data, this.httpOptions())
        .catch(this.handleError.bind(this))
        .map((response: Response) => {
          const res = <VulcainResponse<T>>response.json();
          return res && res.value;
        });
    }
  }

  protected delaySendAction<T>(verb: string, data, args?): Observable<T> {
    // because no relation required simple key/value store is sufficient
    // so no need to go down the indexedDb road here
    return this.storage.getItem(this.EVENT_STORAGE)
      .catch(this.handleError.bind(this))
      .map((items: any[]) => {
        // get non existing item returns null
        let cachedActions: any[];
        if (items === null) {
          cachedActions = [];
        } else {
          cachedActions = items;
        }

        cachedActions.push({
          verb: verb,
          data: data,
          args: args
        });

        this.storage.setItem(this.EVENT_STORAGE, cachedActions)
          .catch(this.handleError.bind(this))
          .subscribe(() => console.log(`event saved ${verb}`));

        // // depending on verb either add, update or delete

        // const action = verb.split('.').pop();
        // switch (action) {
        //   case 'create':
        //     // skip unicity check at the moment
        //     cachedData.push({
        //       verb: verb,
        //       data: data,
        //       args: args
        //     });
        //     break;
        //   case 'update':
        //     const indexOfItem = cachedData.map(d => d.data && d.data.id).indexOf(data.id);
        //     cachedData[indexOfItem] = {
        //       verb: verb,
        //       data: data,
        //       args: args
        //     };
        //     break;
        //   case 'delete':
        //     break;
        // }

        return data;
      });


    // this.storage.getItem(verb).subscribe(items => {
    //   // get non existing item returns null
    //   let cachedData: any[];
    //   if (items === null) {
    //     cachedData = [];
    //   } else {
    //     cachedData = items;
    //   }

    //   return cachedData.push({
    //     verb: verb,
    //     data: data,
    //     args: args
    //   });
    // });
    // return null;
  }

  protected query<T>(verb: string, args?, page?: number, maxByPage?: number, query?): Observable<{ page: number, values: T }> {
    if (page || maxByPage || query) {
      args = args || {};
      args.$page = page;
      args.$maxByPage = maxByPage;
      args.$query = JSON.stringify(query);
    }
    return this.http
      .get(this.resolveBackendUrl(this.baseUrl + verb, args), this.httpOptions())
      .catch(this.handleError.bind(this))
      .map((response: Response) => {
        const res = <VulcainResponse<T>>response.json();
        return { values: res && res.value, page: page };
      });
  }

  // protected getOfflineSavedData<T>(entity: string): Observable<T> {
  //   return Observable.create(observer => {
  //     this.storage.getItem(this.STORE_STORAGE).subscribe(store => {
  //       if (!store) {
  //         observer.onCompleted();
  //       }

  //       const entities = store[entity] || [];
  //       if (entities.length === 0) {
  //         observer.onCompleted();
  //       } else {
  //         entities.map(e => observer.onNext(e));
  //       }
  //     });

  //   });

  // }

  protected get<T>(verb: string, id: string | any, args?): Observable<T> {
    let url = this.baseUrl + verb;
    if (typeof id === 'string') {
      url = url + '/' + id;
      id = null;
    }
    return this.http
      .get(this.resolveBackendUrl(url, id, args), this.httpOptions())
      .catch(this.handleError.bind(this))
      .map((response: Response) => {
        const res = <VulcainResponse<T>>response.json();
        return res && res.value;
      });
  }

  protected handleError(res: Response) {
    if (res && res.status === 401) {
      console.error('Unauthenticated');
      const r = this.onUnauthenticated();
      return r || Observable.throw(new Error('Unauthenticated'));
    }

    let message = `Error status code ${res.status} at ${res.url}`;
    if (res instanceof Response) {
      try {
        const body = <any>res.json();
        if (body && body.error) {
          const error = body.error;
          console.log(error);
          message = '<b>' + (error.message) + '</b>';
          if (error.errors) {
            message = message + ' :<br/>' + error.errors.map(m => m.message).join('</br>');
          }
        }
      } catch (e) {/*ignore*/ }
    }

    this.onError(message);
    return Observable.throw(new Error(message));
  }

  resolveBackendUrl(baseurl: string, ...urlSegments: (string | any)[]): string {

    const hasQueryPoint = baseurl.includes('?');
    if (urlSegments) {
      baseurl += '/';

      const paths: Array<string> = urlSegments.filter((s: any) => typeof s === 'string');

      if (hasQueryPoint && paths.length >= 1) {
        throw new Error('You can\'t have a path on your url after a query string');
      } else {
        baseurl += paths.map((s: string) => encodeURIComponent(s)).join('/');
      }

      const query = urlSegments.filter((s: any) => s && typeof s !== 'string');
      if (query.length) {
        let sep = hasQueryPoint ? '&' : '?';
        query.forEach((obj: any) => {
          for (const p in obj) {
            if (!obj.hasOwnProperty(p)) {
              continue;
            }
            if (obj[p]) {
              baseurl = baseurl.concat(sep, p, '=', encodeURIComponent(obj[p]));
              sep = '&';
            }
          }
        });
      }
      return baseurl;
    } else {
      return baseurl;
    }
  }

  /**
  * Action: Create a new entity
  * @params {string} label - .
  * @params {string} id - .
  * @params [optional] args - additional url parameters
  */
  sportCreate<T>(label: string, id: string, args?): Observable<T> {
    const $data = { label, id };
    return this.sportCreateEntity<T>($data, args);
  }

  /**
  * Action: Create a new entity
  * @params {Sport} entity -
  * @params [optional] args - additional url parameters
  */
  sportCreateEntity<T>(data: Sport, args?): Observable<T> {
    return this.sendAction<T>('sport.create', data, args);
  }
  /**
  * Action: Update an entity
  * @params {string} label - .
  * @params {string} id - .
  * @params [optional] args - additional url parameters
  */
  sportUpdate<T>(label: string, id: string, args?): Observable<T> {
    const $data = { label, id };
    return this.sportUpdateEntity<T>($data, args);
  }

  /**
  * Action: Update an entity
  * @params {Sport} entity -
  * @params [optional] args - additional url parameters
  */
  sportUpdateEntity<T>(data: Sport, args?): Observable<T> {
    return this.sendAction<T>('sport.update', data, args);
  }
  /**
  * Action: Delete an entity
  * @params {string} label - .
  * @params {string} id - .
  * @params [optional] args - additional url parameters
  */
  sportDelete<T>(label: string, id: string, args?): Observable<T> {
    const $data = { label, id };
    return this.sportDeleteEntity<T>($data, args);
  }

  /**
  * Action: Delete an entity
  * @params {Sport} entity -
  * @params [optional] args - additional url parameters
  */
  sportDeleteEntity<T>(data: Sport, args?): Observable<T> {
    return this.sendAction<T>('sport.delete', data, args);
  }
  /**
  * Action: Provides way to update a game (Score, Incidents)
  * @params {string} awayTeamId - .
  * @params {string} homeTeamId - .
  * @params {string} where - .
  * @params {string} seasonId - .
  * @params {string} date - .
  * @params {string} id - .
  * @params {number} homeScore - .
  * @params {number} awayScore - .
  * @params {boolean} played - .
  * @params {Incident[]} incidents - .
  * @params [optional] args - additional url parameters
  */
  seasonUpdategame<T>(awayTeamId: string, homeTeamId: string, where: string, seasonId: string, date: string, id: string, homeScore?: number, awayScore?: number, played?: boolean, incidents?: Incident[], args?): Observable<T> {
    const $data = { awayTeamId, homeTeamId, where, seasonId, date, id, homeScore, awayScore, played, incidents };
    return this.seasonUpdategameEntity<T>($data, args);
  }

  /**
  * Action: Provides way to update a game (Score, Incidents)
  * @params {Game} entity -
  * @params [optional] args - additional url parameters
  */
  seasonUpdategameEntity<T>(data: Game, args?): Observable<T> {
    return this.sendAction<T>('season.updategame', data, args);
  }
  /**
  * Action: Provides way to report an injury
  * @params {string} createdBy - The id of the user that has reported in first the incident
  * @params {string[]} protagonists - The list of protagonist ids
  * @params {number} minute - At what minute, the incident happened
  * @params {string} description - .
  * @params {string} id - .
  * @params {string} gameId - .
  * @params {string} seasonId - .
  * @params [optional] args - additional url parameters
  */
  seasonReportinjury<T>(createdBy: string, protagonists: string[], minute: number, description: string, id: string, gameId: string, seasonId: string, args?): Observable<T> {
    const $data = { createdBy, protagonists, minute, description, id, gameId, seasonId };
    return this.seasonReportinjuryEntity<T>($data, args);
  }

  /**
  * Action: Provides way to report an injury
  * @params {InjuryReport} entity -
  * @params [optional] args - additional url parameters
  */
  seasonReportinjuryEntity<T>(data: InjuryReport, args?): Observable<T> {
    return this.sendAction<T>('season.reportinjury', data, args);
  }
  /**
  * Action: Create a new entity
  * @params {string} sportId - .
  * @params {string} endDate - .
  * @params {string} startDate - .
  * @params {string} id - .
  * @params {Game[]} games - .
  * @params [optional] args - additional url parameters
  */
  seasonCreate<T>(sportId: string, endDate: string, startDate: string, id: string, games?: Game[], args?): Observable<T> {
    const $data = { sportId, endDate, startDate, id, games };
    return this.seasonCreateEntity<T>($data, args);
  }

  /**
  * Action: Create a new entity
  * @params {Season} entity -
  * @params [optional] args - additional url parameters
  */
  seasonCreateEntity<T>(data: Season, args?): Observable<T> {
    return this.sendAction<T>('season.create', data, args);
  }
  /**
  * Action: Update an entity
  * @params {string} sportId - .
  * @params {string} endDate - .
  * @params {string} startDate - .
  * @params {string} id - .
  * @params {Game[]} games - .
  * @params [optional] args - additional url parameters
  */
  seasonUpdate<T>(sportId: string, endDate: string, startDate: string, id: string, games?: Game[], args?): Observable<T> {
    const $data = { sportId, endDate, startDate, id, games };
    return this.seasonUpdateEntity<T>($data, args);
  }

  /**
  * Action: Update an entity
  * @params {Season} entity -
  * @params [optional] args - additional url parameters
  */
  seasonUpdateEntity<T>(data: Season, args?): Observable<T> {
    return this.sendAction<T>('season.update', data, args);
  }
  /**
  * Action: Delete an entity
  * @params {string} sportId - .
  * @params {string} endDate - .
  * @params {string} startDate - .
  * @params {string} id - .
  * @params {Game[]} games - .
  * @params [optional] args - additional url parameters
  */
  seasonDelete<T>(sportId: string, endDate: string, startDate: string, id: string, games?: Game[], args?): Observable<T> {
    const $data = { sportId, endDate, startDate, id, games };
    return this.seasonDeleteEntity<T>($data, args);
  }

  /**
  * Action: Delete an entity
  * @params {Season} entity -
  * @params [optional] args - additional url parameters
  */
  seasonDeleteEntity<T>(data: Season, args?): Observable<T> {
    return this.sendAction<T>('season.delete', data, args);
  }
  /**
  * Action: Create a new entity
  * @params {string} sportId - .
  * @params {string} id - .
  * @params {Player[]} players - .
  * @params {Coach} coach - .
  * @params [optional] args - additional url parameters
  */
  teamCreate<T>(sportId: string, id: string, players?: Player[], coach?: Coach, args?): Observable<T> {
    const $data = { sportId, id, players, coach };
    return this.teamCreateEntity<T>($data, args);
  }

  /**
  * Action: Create a new entity
  * @params {Team} entity -
  * @params [optional] args - additional url parameters
  */
  teamCreateEntity<T>(data: Team, args?): Observable<T> {
    return this.sendAction<T>('team.create', data, args);
  }
  /**
  * Action: Update an entity
  * @params {string} sportId - .
  * @params {string} id - .
  * @params {Player[]} players - .
  * @params {Coach} coach - .
  * @params [optional] args - additional url parameters
  */
  teamUpdate<T>(sportId: string, id: string, players?: Player[], coach?: Coach, args?): Observable<T> {
    const $data = { sportId, id, players, coach };
    return this.teamUpdateEntity<T>($data, args);
  }

  /**
  * Action: Update an entity
  * @params {Team} entity -
  * @params [optional] args - additional url parameters
  */
  teamUpdateEntity<T>(data: Team, args?): Observable<T> {
    return this.sendAction<T>('team.update', data, args);
  }
  /**
  * Action: Delete an entity
  * @params {string} sportId - .
  * @params {string} id - .
  * @params {Player[]} players - .
  * @params {Coach} coach - .
  * @params [optional] args - additional url parameters
  */
  teamDelete<T>(sportId: string, id: string, players?: Player[], coach?: Coach, args?): Observable<T> {
    const $data = { sportId, id, players, coach };
    return this.teamDeleteEntity<T>($data, args);
  }

  /**
  * Action: Delete an entity
  * @params {Team} entity -
  * @params [optional] args - additional url parameters
  */
  teamDeleteEntity<T>(data: Team, args?): Observable<T> {
    return this.sendAction<T>('team.delete', data, args);
  }
  /**
  * Action: Custom action
  * @params [optional] args - additional url parameters
  */
  customerMyaction<T>(args?): Observable<T> {
    const $data = null;
    const response = this.sendAction<T>('customer.myaction', $data, args);
    return response;
  }
  /**
  * Action: Create a new entity
  * @params {string} lastName - .
  * @params {string} firstName - .
  * @params [optional] args - additional url parameters
  */
  customerCreate<T>(lastName: string, firstName: string, args?): Observable<T> {
    const $data = { lastName, firstName };
    return this.customerCreateEntity<T>($data, args);
  }

  /**
  * Action: Create a new entity
  * @params {Customer} entity -
  * @params [optional] args - additional url parameters
  */
  customerCreateEntity<T>(data: Customer, args?): Observable<T> {
    return this.sendAction<T>('customer.create', data, args);
  }
  /**
  * Action: Update an entity
  * @params {string} lastName - .
  * @params {string} firstName - .
  * @params [optional] args - additional url parameters
  */
  customerUpdate<T>(lastName: string, firstName: string, args?): Observable<T> {
    const $data = { lastName, firstName };
    return this.customerUpdateEntity<T>($data, args);
  }

  /**
  * Action: Update an entity
  * @params {Customer} entity -
  * @params [optional] args - additional url parameters
  */
  customerUpdateEntity<T>(data: Customer, args?): Observable<T> {
    return this.sendAction<T>('customer.update', data, args);
  }
  /**
  * Action: Delete an entity
  * @params {string} lastName - .
  * @params {string} firstName - .
  * @params [optional] args - additional url parameters
  */
  customerDelete<T>(lastName: string, firstName: string, args?): Observable<T> {
    const $data = { lastName, firstName };
    return this.customerDeleteEntity<T>($data, args);
  }

  /**
  * Action: Delete an entity
  * @params {Customer} entity -
  * @params [optional] args - additional url parameters
  */
  customerDeleteEntity<T>(data: Customer, args?): Observable<T> {
    return this.sendAction<T>('customer.delete', data, args);
  }
  /**
  * Get an entity by id
  * @params id string - unique id
  */
  getSport<T>(id: string): Observable<T> {

    const response = this.get<T>('sport.get', id, null);
    return response;
  }
  /**
  * Get all entities
  * @params {any} query - Query filter
  * @params [optional] query - filter query
  * @params {number} page - Page to retrieve
  * @params {number} maxByPage - Item by page (default 100)
  */
  getAllSport<T>(query?, page?: number, maxByPage?: number) {
    const response = this.query<T>('sport.all', null, page, maxByPage, query);
    return response;
  }
  /**
  * Get an entity by id
  * @params id string - unique id
  */
  getTeam<T>(id: string): Observable<T> {

    const response = this.get<T>('team.get', id, null);
    return response;
  }
  /**
  * Get all entities
  * @params {any} query - Query filter
  * @params [optional] query - filter query
  * @params {number} page - Page to retrieve
  * @params {number} maxByPage - Item by page (default 100)
  */
  getAllTeam<T>(query?, page?: number, maxByPage?: number) {
    const response = this.query<T>('team.all', null, page, maxByPage, query);
    return response;
  }
  /**
  * Get an entity by id
  * @params id string - unique id
  */
  getSeason<T>(id: string): Observable<T> {

    const response = this.get<T>('season.get', id, null);
    return response;
  }
  /**
  * Get all entities
  * @params {any} query - Query filter
  * @params [optional] query - filter query
  * @params {number} page - Page to retrieve
  * @params {number} maxByPage - Item by page (default 100)
  */
  getAllSeason<T>(query?, page?: number, maxByPage?: number) {
    const response = this.query<T>('season.all', null, page, maxByPage, query);
    return response;
  }
  /**
  * Get an entity by id
  * @params id string - unique id
  */
  getPlayer<T>(id: string): Observable<T> {

    const response = this.get<T>('player.get', id, null);
    return response;
  }
  /**
  * Get all entities
  * @params {any} query - Query filter
  * @params [optional] query - filter query
  * @params {number} page - Page to retrieve
  * @params {number} maxByPage - Item by page (default 100)
  */
  getAllPlayer<T>(query?, page?: number, maxByPage?: number) {
    const response = this.query<T>('player.all', null, page, maxByPage, query);
    return response;
  }
  /**
  * Get an entity by id
  * @params id string - unique id
  */
  getGame<T>(id: string): Observable<T> {

    const response = this.get<T>('game.get', id, null);
    return response;
  }
  /**
  * Get all entities
  * @params {any} query - Query filter
  * @params [optional] query - filter query
  * @params {number} page - Page to retrieve
  * @params {number} maxByPage - Item by page (default 100)
  */
  getAllGame<T>(query?, page?: number, maxByPage?: number) {
    const response = this.query<T>('game.all', null, page, maxByPage, query);
    return response;
  }
  /**
  * Get an entity by id
  * @params id string - unique id
  */
  getCustomer<T>(id: string): Observable<T> {

    const response = this.get<T>('customer.get', id, null);
    return response;
  }
  /**
  * Get all entities
  * @params {any} query - Query filter
  * @params [optional] query - filter query
  * @params {number} page - Page to retrieve
  * @params {number} maxByPage - Item by page (default 100)
  */
  getAllCustomer<T>(query?, page?: number, maxByPage?: number) {
    const response = this.query<T>('customer.all', null, page, maxByPage, query);
    return response;
  }
}
