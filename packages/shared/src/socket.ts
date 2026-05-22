export function socketBaseUrl(apiBaseUrl: string) {
  return apiBaseUrl.replace(/\/api\/v1\/?$/, '');
}