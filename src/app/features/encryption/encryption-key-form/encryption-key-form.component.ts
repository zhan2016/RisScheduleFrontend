import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { KeyStatus } from 'src/app/core/models/common-models';
import { EncryptionKey } from 'src/app/core/models/encryption-key';

@Component({
  selector: 'app-encryption-key-form',
  templateUrl: './encryption-key-form.component.html',
  styleUrls: ['./encryption-key-form.component.scss']
})
export class EncryptionKeyFormComponent implements OnInit {

  @Input()
  set data(value: EncryptionKey | null | undefined) {
    if (value) {
      console.log(value?.status, value?.status);
      this.form.patchValue({
        name: value.name,
        isDefault: value.isDefault,
        validRange: [new Date(value.validFrom), new Date(value.validTo)],
        description: value.description,
        status: value?.status || KeyStatus.ACTIVE
      });
    } else {
      this.form.reset({
        isDefault: false
      });
    }
  }

  @Output() formValid = new EventEmitter<boolean>();
  @Output() formValue = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      isDefault: [false],
      validRange: [null, [Validators.required]],
      description: [''],
      status: KeyStatus.ACTIVE,
    });
  }

  ngOnInit(): void {
    // 监听表单状态变化
    this.form.statusChanges.subscribe(status => {
      this.formValid.emit(status ===  'VALID');
    });

    // 监听表单值变化
    this.form.valueChanges.subscribe(value => {
      this.formValue.emit(value);
    });
  }

  getFormValue(): any {
    const formValue = this.form.value;
    return {
      name: formValue.name,
      isDefault: formValue.isDefault,
      validFrom: formValue.validRange[0],
      validTo: formValue.validRange[1],
      description: formValue.description,
      status: formValue.status 
    };
  }

}
