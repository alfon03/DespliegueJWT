import { HttpInterceptorFn } from '@angular/common/http';

export const JwTincep: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('token');
  console.log('Interceptor')
  if (token) {
    req = req.clone({
      setHeaders: {"Authorization": `Bearer ${token}`}
    })
  }
  return next(req);
};