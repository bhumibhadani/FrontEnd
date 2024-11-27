export interface CarModel {
  id: number;
  brand:string;
  class:string;
  modelName: string;
  modelCode: string;
  images: any;
  fileName:any;
  price: number;
  dateOfManufacturing: Date;
  sortOrder: number;
  active: boolean;
}