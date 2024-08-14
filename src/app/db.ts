import Dexie, {Table} from "dexie";

//interface for single survey data
export interface ISurvey {
  id?:number;
  surveyor: string;
  ripeCount: number;
  notRipeCount: number;
  surveyTime: Date;
}

export class AppDB extends Dexie {
  survey!: Table<ISurvey, number>;

  //creates a new indexdb which stores surveys
  constructor() {
    super('ngdexieliveQuery');
    this.version(3).stores({
      survey: '++id',
    });
    //console.log(this.survey);
    this.open()
      .then(data => console.log("DB Opened"))
      .catch(err => console.log(err.message));
    //this.on('populate', () => this.populate());
    //console.log(this.survey);
  }

  // async populate() {
  //   const surveyID = await db.survey.add({
  //     surveyor: "Luke Laing",
  //     ripeCount: 0,
  //     notRipeCount: 0,
  //     surveyTime: new Date().toISOString(),
  //   });
  //   console.log("Populated");
  // }

  //returns current surveys stored in indexeddb in array form
  async getSurveys() {
    return this.survey.toArray();
  }

  //removes all surveys currently stored
  clearCache(){
    this.survey.clear();
  }
}

export const db : AppDB = new AppDB();
