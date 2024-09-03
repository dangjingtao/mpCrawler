import { Log, visitByFrame } from "@/lib";

// comments
const handleComments = ($childDocument: JQuery<HTMLElement>, logger: Log) => {
  const comments: any = [];
  const $comments = $childDocument.find(".comment-list__item-time").prev();
  $.each($comments, (i, x) => comments.push($(x).text()));
  return Array.from(new Set(comments));
};

export const getComments = async (
  $containerEl: JQuery<HTMLElement>,
  logger: Log
) => {
  const startTime = Date.now();
  const $comments = $containerEl.find(".appmsg-comment");
  const commentLength = $containerEl.find(".appmsg-comment").text();
  const commentHref = $comments.attr("href");
  let commentsDocuments = [];
  logger.warn(`是否需要爬取评论？---> ${!!Number(commentLength)}`);
  if (Number(commentLength)) {
    const commentsSrc = "/cgi-bin/loginpage?url=" + commentHref || "";
    commentsDocuments = await visitByFrame(commentsSrc, handleComments, logger);

    const endTime = Date.now();
    logger.log(`爬取评论完毕，用时 ${endTime - startTime} ms`);
  }
  return commentsDocuments;
};
