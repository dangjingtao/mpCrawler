import { Log } from "./Log";

export const getIframeDocument = (iframe: any): PromiseLike<Document> => {
  return new Promise((resolve, reject) => {
    iframe.addEventListener("load", () => {
      resolve(iframe.contentDocument);
    });

    iframe.addEventListener("error", (e: any) => {
      reject(e);
    });
  });
};

export const visitByFrame = async (
  href: string,
  onDocumentGet?: Function,
  logger?: Log,
  isDebug?: Boolean
) => {
  try {
    const iframe = document.createElement("iframe");
    iframe.src = href;
    iframe.style.display = isDebug ? "block" : "none";

    document.body.appendChild(iframe);
    const childDocument = await getIframeDocument(iframe);
    const $childDocument = $(childDocument);
    const result = onDocumentGet
      ? await onDocumentGet($childDocument, logger)
      : $childDocument;

    if (!isDebug && onDocumentGet) {
      iframe.parentNode?.removeChild(iframe);
      console.clear();
    }
    return result;
  } catch (error: any) {
    logger?.error(`visit by frame error: ${error?.message}`);
  }
};
