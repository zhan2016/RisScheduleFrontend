import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EditorService } from 'src/app/core/services/editor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  editorId = 'design-editor';
  private editor: any;
  constructor(
    private editorService: EditorService
  ) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.initializeEditor();
  }
  ngOnDestroy() {
    this.editorService.destroyEditor();
  }

  private initializeEditor() {
    try {
      // 确保DOM元素已经准备好
      setTimeout(() => {
        this.editor = this.editorService.initializeEditor(this.editorId);
        this.setupEditor();
      }, 0);
    } catch (error) {
      console.error('Failed to initialize editor:', error);
    }
  }

  private setupEditor() {
    if (!this.editor) return;

    // 这里可以添加编辑器的其他配置
    try {
      // 示例：设置编辑器内容
      // this.editor.setContent('Initial content');

      // 示例：添加编辑器事件监听
      // this.editor.on('change', () => {
      //   console.log('Content changed');
      // });
    } catch (error) {
      console.error('Editor setup failed:', error);
    }
  }

}
