export const getQueryObject = (url?: string) =>
  new URLSearchParams(url || window.location.search);

export const getQueryStringByKey = (key: string, url?: string) =>
  getQueryObject(url).get(key);

export const getQueryStringByObject = (obj: any, url?: string) =>
  (url ? url + "?" : "") + new URLSearchParams(obj).toString();

export const getQueryStringUrl = (url: URL | String, params: Object) => {
  const qs = getQueryStringByObject(params);
  const rootPage = `${url}?${qs}`;
  return rootPage;
};
