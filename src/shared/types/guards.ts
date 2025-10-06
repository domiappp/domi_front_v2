// src/shared/types/guards.ts
import type { LoginResponse, LoginSuccess } from './users-type'

export function isLoginSuccess(data: LoginResponse): data is LoginSuccess {
  return data?.ok === true
}
