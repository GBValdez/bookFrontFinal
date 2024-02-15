export interface catalogueInterface {
  id?: number | string;
  name: string;
}
export interface catalogueQuery {
  nameCont?: string;
}

export interface catalogueModal {
  typeCatalogue: string;
  title: string;
  catalogue?: catalogueInterface;
}
export interface pagDto<T> {
  items: T[];
  total: number;
  index: number;
  totalPages: number;
}
