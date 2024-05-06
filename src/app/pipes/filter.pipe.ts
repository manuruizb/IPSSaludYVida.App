import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPosts = [];
    for (const post of value) {
      if (post.text.toUpperCase().indexOf(arg.toUpperCase()) > -1) {
        resultPosts.push(post);
      };
    };
    return resultPosts;
  }

}
