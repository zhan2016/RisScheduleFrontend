import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Env } from 'env';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  public readonly copyrights = Env.copyRights;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    // 如果已经登录，直接跳转到主页面
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      passwordHash: ['', [Validators.required]],
      timestamp:[null],
    });
    this.route.queryParams.subscribe(q => {
      const { username, password } = q;
      if (username && password) {
        this.form.setValue({ username, passwordHash: password, timestamp: null });
        this.login();                       // 复用现有方法
      }
    });
  }

  login(): void {
    if (this.form.valid) {
      this.isLoading = true;
      const { username, passwordHash } = this.form.value;

      this.authService.login(username, passwordHash)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: () => {
            this.message.success('登录成功');
            
            // 根据用户角色跳转到不同页面
            if (this.authService.isAdmin()) {
              //this.router.navigate(['/']);
               this.router.navigate(['/'], { replaceUrl: true });
            } else {
              //this.router.navigate(['/']);
               this.router.navigate(['/'], { replaceUrl: true });
            }
          },
          error: (error) => {
            console.log(error, error);
            this.message.error(error.error?.message || '登录失败，请检查用户名和密码');
            this.form.patchValue({ passwordHash: '' });
          }
        });
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control) {
      if (control.hasError('required')) {
        return `请输入${controlName === 'username' ? '用户名' : '密码'}`;
      }
      if (controlName === 'password' && control.hasError('minlength')) {
        return '密码长度不能少于6位';
      }
    }
    return '';
  }

}
