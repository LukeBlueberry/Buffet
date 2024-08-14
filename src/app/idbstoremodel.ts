import {Survey} from './tableschema';

const surveyInstance = new Survey();

function generateColumns<T extends Record<string, any>>(instance: T): string {
  return (Object.keys(instance) as (keyof T)[]).join(',');
}

export const DBStores = {
  Survey: {
    TableName: 'Survey',
    Columns: generateColumns(surveyInstance),
  }
}
