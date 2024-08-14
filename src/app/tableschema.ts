import Dexie, {Collection} from "dexie";


export interface ISurvey {
  id: string;
  surveyor: string;
  ripeCount: number;
  notRipeCount: number;
  surveyTime: string;
}

export class Survey implements ISurvey {
  id = '';
  surveyor = "Luke Laing";
  ripeCount = 0;
  notRipeCount = 0;
  surveyTime = '';
}

export interface ITableSchema {
  name: string;
  schema: string;
}

export interface IDexieTableSchema {
  name: string;
  primKey: { src: string };
  indexes: { src: string }[];
}

export interface IFilterDelegate {
  (dbSet: Dexie.Table): Collection;
}


