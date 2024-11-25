// editor.service.ts
import { Injectable } from '@angular/core';

declare global {
  interface Window {
    THCEmrViewLib: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private emrViewLib: any;

  initializeEditor(containerId: string) {
    try {
      this.emrViewLib = new window.THCEmrViewLib({
        el: containerId,
        meaChr: true,
        embResources: true,
        designMode: true,
        hcServer:"http://127.0.0.1:12880/"
      });

      return this.emrViewLib;
    } catch (error) {
      console.error('Editor initialization failed:', error);
      throw error;
    }
  }

  getEditor() {
    return this.emrViewLib;
  }

  // 销毁编辑器
  destroyEditor() {
    if (this.emrViewLib) {
      // 根据实际API调用销毁方法
      // this.emrViewLib.destroy();
      this.emrViewLib = null;
    }
  }
}