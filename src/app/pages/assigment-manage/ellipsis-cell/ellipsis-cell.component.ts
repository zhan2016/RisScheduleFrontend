import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ellipsis-cell',
  templateUrl: './ellipsis-cell.component.html',
  styleUrls: ['./ellipsis-cell.component.scss']
})
export class EllipsisCellComponent implements OnInit {
  @Input() content: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
