import { downloadJSON, createAndDownloadZip } from "@/lib";
import { cleanMainText, cleanAnalysisData } from "./modules/cleanData";
import CONFIG from "./CONFIG";

const { ARTICLE_LIST_KEY, ARTICLE_FINISHED_FLAG } = CONFIG.global;

export function exportArticles() {
  const articleList: any[] = GM_getValue(ARTICLE_LIST_KEY);
  const isComplete = GM_getValue(ARTICLE_FINISHED_FLAG);
  if (isComplete) {
    const articleListLite = JSON.parse(JSON.stringify(articleList));
    articleList.forEach((article, i) => {
      const articleLite = articleListLite[i];
      const { title, detailText, analysisData } = article;
      articleLite.textContent = cleanMainText(detailText);
      articleLite.analysisData = cleanAnalysisData(title, analysisData);
      delete articleLite._title;
      delete articleLite.detailText;
      delete articleLite.publishTime;
    });
    // 数据清洗
    // cleanMainText();
    const filesToZip = [
      { fileName: "dataLite.json", content: JSON.stringify(articleListLite) },
      { fileName: "data.json", content: JSON.stringify(articleList) },
      {
        fileName: "page.html",
        content:
          "<!DOCTYPE html><html><body><h1>Hello World!</h1></body></html>",
      },
    ];
    createAndDownloadZip(filesToZip);
    // downloadJSON(articleListLite);
    // downloadJSON(articleList);
  }
}
