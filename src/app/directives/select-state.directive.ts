import { Directive, ElementRef, HostListener, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: 'select.form-control-modern'
})
export class SelectStateDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateState();
  }

  @HostListener('change')
  onChange() {
    this.updateState();
  }

  @HostListener('blur')
  onBlur() {
    this.updateState();
  }

  private updateState() {
    const selectElement = this.el.nativeElement as HTMLSelectElement;
    const hasValue = selectElement.value && selectElement.value !== '';
    
    if (hasValue) {
      this.renderer.addClass(selectElement, 'has-value');
    } else {
      this.renderer.removeClass(selectElement, 'has-value');
    }
  }
}
