import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchWorkSite',
  standalone: false,
})
export class SearchWorkSitePipe implements PipeTransform {
  transform(words: any, filterText: string = '') {
    if (words.length === 0 || filterText === '') {
      return words;
    } else {
      return words.filter((workSite: any) => {
        return (
          workSite.work_site_name
            .toLowerCase()
            .indexOf(filterText.toLowerCase().trim()) > -1
        );
      });
    }
  }
}
