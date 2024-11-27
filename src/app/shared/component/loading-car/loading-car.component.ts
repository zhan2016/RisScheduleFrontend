import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-car',
  templateUrl: './loading-car.component.html',
  styleUrls: ['./loading-car.component.scss']
})
export class LoadingCarComponent implements OnInit {
  @Input() loadingText = '正在生成授权...'; // 默认文本
  visible = true;
  constructor() { }

  ngOnInit(): void {
  }

}
