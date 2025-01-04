import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'app-status-tag',
  templateUrl: './status-tag.component.html',
  styleUrls: ['./status-tag.component.scss']
})
export class StatusTagComponent implements ICellRendererAngularComp {
  params: any;
  isError: boolean = false;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.isError = params.data?.isProcessed === '0';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
