import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoadingCarComponent } from 'src/app/shared/component/loading-car/loading-car.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private modalService: NzModalService) {}

  showLoading(text: string = '正在加载...') {
    return this.modalService.create({
      nzContent: LoadingCarComponent,
      nzComponentParams: {
        loadingText: text
      },
      nzFooter: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzWidth: 400,
      nzBodyStyle: { padding: '40px 0' }
    });
  }
}
