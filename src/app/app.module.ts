import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US, zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ApiResponseInterceptor } from './core/interceptors/api-response.interceptor';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { MonacoEditorModule } from 'ngx-monaco-editor';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    SharedModule,
    NzMessageModule,
    MonacoEditorModule.forRoot({
      baseUrl: 'assets', // configure base path for monaco editor
      defaultOptions: { scrollBeyondLastLine: false }
    })
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiResponseInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
