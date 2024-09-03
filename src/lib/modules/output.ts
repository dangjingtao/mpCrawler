import * as xlsx from "xlsx";

export const downloadXLS2JSON = async (downloadHref: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(downloadHref);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = function () {
        const res: any = this.result;
        const { SheetNames, Sheets } = xlsx.read(new Uint8Array(res), {
          type: "array",
        });
        const sheet = Sheets[SheetNames[0]];
        const ret = xlsx.utils.sheet_to_json(sheet);
        resolve(ret);
      };
      reader.readAsArrayBuffer(blob);
    } catch (error) {
      reject(error);
    }
  });
};

export const downloadJSON = (
  object: any,
  filename: string = "data.json"
): void => {
  const jsonString = JSON.stringify(object);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
};

// 定义一个函数，接受一个对象数组，每个对象包含文件名和文件内容
export function createAndDownloadZip(
  files: { fileName: string; content: string }[]
) {
  // 创建JSZip实例
  const zip = new JSZip();

  // 遍历文件数组，添加文件到zip中
  files.forEach((file) => {
    zip.file(file.fileName, file.content);
  });

  // 生成zip文件的Blob
  const content = zip.generateAsync({ type: "blob" });

  // 处理生成的Blob
  content.then((blob: Blob) => {
    // 创建一个下载链接
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    // 设置下载链接的属性
    downloadLink.href = url;
    downloadLink.download = "download.zip"; // 你可以自定义zip文件的名称

    // 将下载链接添加到文档中并模拟点击
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // 从文档中移除下载链接
    document.body.removeChild(downloadLink);

    // 释放Blob URL
    window.URL.revokeObjectURL(url);
  });
}

// // 示例使用
// const filesToZip = [
//   { fileName: "data.json", content: JSON.stringify({ key: "value" }) },
//   {
//     fileName: "page.html",
//     content: "<!DOCTYPE html><html><body><h1>Hello World!</h1></body></html>",
//   },
// ];

// createAndDownloadZip(filesToZip);
