import dayjs from "dayjs";
import { Log, visitByFrame, getQueryStringByKey } from "@/lib";

// detail
const handleDetail = ($document: JQuery<HTMLElement>, logger: Log) => {
  const title = $document.find("h1").text().trim();
  const [date, publishFoarmatTime] = $document
    .find("#publish_time")
    .text()
    .trim()
    .split(" ");
  const publishDate = date
    .replace("年", "-")
    .replace("月", "-")
    .replace("日", "");
  const publishTime = dayjs(`${publishDate} ${publishFoarmatTime}`);
  const ipLocation = $document.find("#js_ip_wording").text().trim();

  const author = (
    $document.find("#js_name").parent().prev().text() ||
    $document.find("#js_name").text()
  ).trim();

  const detailText = $document.find(".rich_media_content").html();

  const meta = {
    title,
    author,
    ipLocation,
    publishDate,
    publishFoarmatTime,
    publishTime,
    detailText,
  };
  return meta;
};

export const getDetailData = async (
  $containerEl: JQuery<HTMLElement>,
  logger: Log
) => {
  const startTime = Date.now();
  const $link = $($containerEl.find("a")[0]);
  const detailHref = $link.attr("href") || "";
  const mid = getQueryStringByKey("mid", detailHref);
  const detailData = detailHref.startsWith("https")
    ? await visitByFrame(detailHref, handleDetail, logger)
    : null;
  const endTime = Date.now();
  logger.info(`爬取详情完毕, 用时${endTime - startTime} ms`);

  return { detailHref, mid, ...detailData };
};
