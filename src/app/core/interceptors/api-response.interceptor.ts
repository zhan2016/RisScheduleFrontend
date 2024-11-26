import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorDetails {
  exceptionType: string;
  stackTrace: string;
  innerException: string | null;
}

const SuccessCode = [200, 201]

@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {

  constructor(private message: NzMessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map(event => {
        //console.log(event, event instanceof HttpResponse);
        if (event instanceof HttpResponse && !(event.body instanceof Blob)) {
          if (this.isApiResponse(event.body)) {
            const apiResponse = event.body as ApiResponse<any>;
            //console.log(apiResponse, apiResponse);
            // 处理业务层面的错误
            if (!apiResponse.success || !SuccessCode.includes(apiResponse.code)) {
             
              this.message.error(apiResponse.message || '操作失败');
              // 创建一个新的 HttpErrorResponse
              throw new HttpErrorResponse({
                error: apiResponse.message,
                status: apiResponse.code,
                statusText: apiResponse.message
              });
            }
            
            // 成功情况下直接返回 data
            return event.clone({ body: apiResponse.data });
          }
          
          // 非标准响应格式，直接返回原始数据
          return event;
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;
        
        // 处理 API 响应格式的错误
        if (error.error && this.isApiResponse(error.error)) {
          const apiError = error.error as ApiResponse<ErrorDetails>;
          errorMessage = this.decodeUnicode(apiError.message);
        } else if (error.error instanceof ErrorEvent) {
          // 客户端错误
          errorMessage = error.error.message;
        } else {
          // 其他服务器错误
          switch (error.status) {
            case 401:
              errorMessage = '未授权，请重新登录';
              break;
            case 403:
              errorMessage = '拒绝访问';
              break;
            case 404:
              errorMessage = '请求的资源不存在';
              break;
            case 400:
              errorMessage = error.error?.message || '请求参数错误';
              break;
            case 500:
              errorMessage = '服务器错误';
              break;
            default:
              errorMessage = error.error?.message || `服务器返回错误 (${error.status})`;
          }
        }
        
        if (!this.isApiErrorHandled(error)) {
          this.message.error(errorMessage);
        }
        
        return throwError(() => error);
      })
    );
  }

  private isApiResponse(body: any): boolean {
    return body 
      && typeof body.code !== 'undefined'
      && typeof body.success !== 'undefined'
      && typeof body.message !== 'undefined'
      && typeof body.data !== 'undefined';
  }

  private isApiErrorHandled(error: HttpErrorResponse): boolean {
    // 检查错误是否已经被处理过（避免重复显示错误消息）
    return error.error instanceof ErrorEvent || error instanceof HttpErrorResponse && error.status === 0;
  }
  private decodeUnicode(str: string): string {
    try {
      return str.replace(/\\u[\dA-F]{4}/gi, match => 
        String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
      );
    } catch {
      return str;
    }
  }
}
