import { Directive, AfterViewInit,ElementRef} from '@angular/core';
@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private el:ElementRef) {
   }
  ngAfterViewInit(){
    setTimeout(()=>{
      this.el.nativeElement.focus();
     },300)
  }
}