import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {

  transform(items: any[], key: string, searchValue: string): any[]
  {
    if (!items) { return [];  }
    return items.filter(item => {
      if (item && item[key]) {
        return item[key] === searchValue;
      }
      return false;
    });
  }
}
