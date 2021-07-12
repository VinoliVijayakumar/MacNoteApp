import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataFormat'
})
export class DataFormatPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if(value!=null && value.split('\n').length>0){
      let temp = value.split('\n');
      temp.splice(0,1);
      return temp.join("\n ");
    }else{
      return '';
    }    
  }

}
