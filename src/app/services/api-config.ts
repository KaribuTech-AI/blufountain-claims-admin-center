import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  apiBaseUrl: string;
  useMockData: boolean;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('api.config');

export const defaultApiConfig: ApiConfig = {
  apiBaseUrl: '/api',
  useMockData: true,
};
