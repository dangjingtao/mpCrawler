import { Chain, isDayInScope, isDaybefore, Log, isDayAfter } from "@/lib";
import { getMeta } from "./meta";
import { getComments } from "./comment";
import { getDetailData } from "./details";
import { getAnalysisData } from "./analysis";
import CONFIG from "../CONFIG";
const { ARTICLE_FINISHED_FLAG } = CONFIG.global;

type FetchArticleParams = {
  logger: Log;
  articleIndex: number;
  $articleContainers: JQuery<HTMLElement>;
  articleList: any[];
  config: any;
};

/******************************************************************/

const getDateStatus = (publishDate: string, dateScope: string[]) => {
  const [startDate, endDate] = dateScope;
  const scope = isDayInScope(publishDate, [startDate, endDate]);
  const before = isDaybefore(publishDate, startDate);
  const after = isDayAfter(publishDate, startDate);
  const filterObj =
    Object.entries({ scope, before, after }).find(([, val]) => !!val) || [];
  return filterObj[0];
};

export const getArticle = async ({
  articleIndex,
  $articleContainers,
  articleList,
  logger,
  config,
}: FetchArticleParams): Promise<any[]> => {
  const containerEl = $articleContainers.get(articleIndex);
  if (containerEl) {
    logger.log(
      `---------------------------扫描本页第 ${
        articleIndex + 1
      } 篇----------------------------------`
    );

    const $containerEl = $(containerEl);

    const get_meta = async function () {
      const isDel =
        $containerEl
          .find(".weui-desktop-mass-appmsg__tips_content")
          .text()
          .indexOf("删除") === 0;

      if (isDel) {
        logger.error("文章已被删除，将不再爬取");
      }
      return {
        next: !isDel,
        result: !isDel ? getMeta($containerEl, logger) : null,
      };
    };

    const get_detail = async function (preData: any) {
      return {
        next: true,
        result: {
          ...preData,
          ...(await getDetailData($containerEl, logger)),
        },
      };
    };

    const check_date = (preData: any) => {
      const { publishDate } = preData;
      const { startDate, endDate } = config;
      const dateStatus = getDateStatus(publishDate, [startDate, endDate]);
      logger.warn(`dateStatus: ${JSON.stringify(dateStatus)}`);
      // ! 广播消息
      GM_setValue(ARTICLE_FINISHED_FLAG, dateStatus === "before");

      if (dateStatus === "scope") {
        return {
          next: true,
          result: preData,
        };
      } else {
        return {
          next: false,
          result: null,
        };
      }
    };

    const get_comments = async function (preData: any) {
      return {
        next: true,
        result: {
          ...preData,
          comments: await getComments($containerEl, logger),
        },
      };
    };

    const get_analysisData = async function (params: any) {
      return {
        next: false,
        result: {
          ...params,
          analysisData: await getAnalysisData(params, logger),
        },
      };
    };

    let chainHead = new Chain(get_meta);
    chainHead
      .setNext(get_detail)
      .setNext(check_date)
      .setNext(get_comments)
      .setNext(get_analysisData);
    const rs = await chainHead.passReq();

    rs && articleList.push(rs);
    const isComplete = GM_getValue(ARTICLE_FINISHED_FLAG);
    logger.success(`扫描完毕--->`);

    return isComplete
      ? articleList
      : await getArticle({
          articleIndex: articleIndex + 1,
          $articleContainers,
          articleList,
          logger,
          config,
        });
  } else {
    return articleList;
  }
};

export const getCurrentPageArticleList = async (
  $childDocument: any,
  logger: Log,
  config: any
) => {
  const $articleContainers = $childDocument.find(".publish_hover_content");
  const articleList = await getArticle({
    logger,
    articleIndex: 0,
    articleList: [],
    $articleContainers,
    config,
  });
  return articleList;
};
