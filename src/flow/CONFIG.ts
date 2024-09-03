export default {
  global: {
    ARTICLE_LIST_KEY: "MP_ARTICLE_LIST",
    ARTICLE_FINISHED_FLAG: "MP_FINESHED",
  },
  rootPage: {
    url: `https://mp.weixin.qq.com/cgi-bin/appmsgpublish`,
    params: {
      sub: "list",
      lang: "zh_CN",
      count: 20,
    },
  },
};
