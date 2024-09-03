import {
  downloadXLS2JSON,
  getQueryStringUrl,
  getQueryStringByKey,
  Log,
  visitByFrame,
} from "@/lib";

// analysis
export const getAnalysisData = async (detailData: any, logger: Log) => {
  try {
    const startTime = Date.now();

    if (detailData) {
      const pageParams = {
        action: "detailpage",
        msgid: `${getQueryStringByKey("mid", detailData.detailHref)}_1`,
        publish_date: detailData.publishDate,
        type: "int",
        lang: "zh_CN",
        token: getQueryStringByKey("token"),
      };

      const analysisUrl = getQueryStringUrl(
        "https://mp.weixin.qq.com/misc/appmsganalysis",
        pageParams
      );

      const analysisData = await visitByFrame(
        analysisUrl,
        async ($childDocument: JQuery<HTMLElement>) => {
          const downloadHref: string =
            $childDocument.find('a:contains("下载数据明细")').attr("href") ||
            "";
          if (!downloadHref) {
            throw new Error("访问不到分析页面");
          }
          return await downloadXLS2JSON(downloadHref);
        },
        logger
      );

      if (!analysisData) {
        return null;
      }

      const endTime = Date.now();
      logger.info(`爬取分析数据完毕，用时：${endTime - startTime} ms`);
      return analysisData;
    }
    logger.warn(`没有可爬取的分析数据!`);
    return null;
  } catch (error: any) {
    logger.error(`爬取分析数据失败！${error?.message}`);
    return null;
  }
};
