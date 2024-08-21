import Dexie, {Table} from "dexie";

//interface for single survey data
export interface ISurvey {
  id?:number;
  mission: string;
  surveyor: string;
  ripeCount: number;
  notRipeCount: number;
  surveyTime: Date;
  latitude: number;
  longitude: number;
}

export interface IRoute {
  id?:number;
  mission: string;
  latitude: number;
  longitude: number;
}

export interface IPhoto{
  id?:number;
  mission: string;
  latitude: number;
  longitude: number;
  photo: string;
}

export class AppDB extends Dexie {
  survey!: Table<ISurvey, number>;
  route!: Table<IRoute, number>;
  photo!: Table<IPhoto, number>;

  //creates a new indexdb which stores surveys
  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      survey: '++id',
      route: '++id',
      photo: '++id',
    });
    //console.log(this.survey);
    this.open()
      .then(data => console.log("DB Opened"))
      .catch(err => console.log(err.message));
    //this.on('populate', () => this.populate());
    //console.log(this.survey);
  }

  //returns current surveys stored in indexeddb in array form
  async getSurveys() {
    return this.survey.toArray();
  }

  async getRoute() {
    return this.route.toArray();
  }

  async getPhoto(){
    return this.photo.toArray();
  }
  //removes all surveys currently stored
  clearCache(){
    this.survey.clear();
  }
}

export const db : AppDB = new AppDB();
