const api = {
  token: null,
  request(url: string, options: RequestInit = {}) {
    if (this.token) {
      options.headers = {
        ...(options.headers ?? {}),
        Authorization: `Bearer ${this.token}`,
      };
    }
    return fetch(url, options);
  },
} as {
  token: string | null;
  request: (url: string, options: RequestInit) => Promise<Response>;
};

export default api;
