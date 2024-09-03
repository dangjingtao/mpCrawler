import {
  visitByFrame,
  getQueryStringByKey,
  getQueryStringUrl,
  Log,
} from "@/lib";
import { getCurrentPageArticleList } from "./modules/article";
import CONFIG from "./CONFIG";

const rootPageConfig = CONFIG.rootPage;
const { ARTICLE_LIST_KEY, ARTICLE_FINISHED_FLAG } = CONFIG.global;

const getRootPage = (pageIndex: number) => {
  const prarams = rootPageConfig.params;
  const rootPageMeta = {
    ...rootPageConfig.params,
    token: getQueryStringByKey("token"),
    begin: pageIndex * prarams.count,
  };
  const rootPageUrl = getQueryStringUrl(rootPageConfig.url, rootPageMeta);
  return rootPageUrl;
};

// !递归
export async function fetchArticleListPage(
  this: {
    [x: string]: any;
    onAction: (config: any) => Promise<any>;
    logger: Log;
  },
  config: any,
  pageIndex: number = 0
) {
  const { logger } = this;
  logger.info(
    `<b>-----------------------------开始爬取数据-----------------------------</b>`
  );

  const rootPage = getRootPage(pageIndex);

  const currentPageArticleList = await visitByFrame(
    rootPage,
    (...args: [any, any]) => getCurrentPageArticleList(...args, config),
    logger
  );

  const preArticleList: any[] = GM_getValue(ARTICLE_LIST_KEY) || [];

  GM_setValue(ARTICLE_LIST_KEY, [...preArticleList, ...currentPageArticleList]);

  logger.info(
    `<b>---------------------------该版爬取数据结束---------------------------</b>`
  );

  // logger.success(
  //   ` ${rootPageMeta.begin} - ${
  //     rootPageMeta.begin + rootPageMeta.count
  //   } 页数据 爬取完成!`
  // );
  const isComplete = GM_getValue(ARTICLE_FINISHED_FLAG);

  // ! 判断日期
  !isComplete &&
    (await fetchArticleListPage.apply(this, [config, pageIndex + 1]));
  isComplete &&
    logger.success(
      `<b>=======================================所有数据爬取完成======================================</b>`
    );
}
