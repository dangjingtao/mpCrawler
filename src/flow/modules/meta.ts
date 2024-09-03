import { Log } from "@/lib";
// meta
export const getMeta = ($containerEl: JQuery<HTMLElement>, logger: Log) => {
  const $link = $($containerEl.find("a")[0]);
  const _title = $link.text();
  const like = $containerEl.find(".appmsg-like").text();
  const view = $containerEl.find(".appmsg-view").text();
  const concerning = $containerEl.find(".appmsg-haokan").text();
  const isOriginal = !!$link.find("b").text();
  logger.info(`《${_title}》 meta 爬取完毕`);
  return {
    _title,
    like,
    view,
    concerning,
    isOriginal,
  };
};
