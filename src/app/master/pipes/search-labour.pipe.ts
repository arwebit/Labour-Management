import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchLabour',
  standalone: false,
})
export class SearchLabourPipe implements PipeTransform {
  transform(words: any, filterText: string = '') {
    if (words.length === 0 || filterText === '') {
      return words;
    } else {
      return words.filter((users: any) => {
        return (
          users.full_name
            .toLowerCase()
            .indexOf(filterText.toLowerCase().trim()) > -1
        );
      });
    }
  }
}
