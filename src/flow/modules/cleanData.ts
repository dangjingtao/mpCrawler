import { convert } from "html-to-text";

export const cleanAnalysisData = (title: string, data: any) => {
  const transformedData: any = {
    name: title,
    数据概况: {
      "阅读(次)": null,
      "平均停留时长(秒)": null,
      完读率: null,
      "阅读后关注（人）": null,
      "分享(次)": null,
      "在看(次)": null,
      "点赞(次)": null,
      "赞赏(分)": null,
      "评论（条）": null,
      互动率: null,
    },
    阅读转化: {
      送达人数: null,
      公众号消息阅读次数: null,
      首次分享次数: null,
      总分享次数: null,
      分享产生的阅读次数: null,
    },
    推荐转化: {
      曝光次数: null,
      阅读次数: null,
      关注人数: null,
    },
    数据趋势明细: {
      公众号消息: [],
      公众号主页: [],
      聊天会话: [],
      搜一搜: [],
      朋友圈: [],
      其他: [],
    },
    性别分布: {
      男: null,
      女: null,
    },
    年龄分布: {},
    地域分布: {},
  };
  if (!data) {
    return { ...transformedData, message: "cookie被限制" };
  }
  const commonTransfer = (k: string) => {
    Object.entries(transformedData[k]).forEach(([key]) => {
      const item = data.find((x: any) => x[title] === key) || {};
      if (key) {
        transformedData[k][key] = item["__EMPTY"];
      }
    });
  };

  const commonTransfer2 = (k: string) => {
    const preFlag = data.findIndex((x: any) => x[title] === k) + 2;
    for (let index = preFlag; index < data.length; index++) {
      const key = data[index][title];
      const val = data[index]["__EMPTY"];
      if (val) {
        transformedData[k][key] = val;
      } else {
        break;
      }
    }
  };

  const commomTransfer3 = (k: string) => {
    const preFlag = data.findIndex((x: any) => x[title] === k) + 1;
    let keymap: any[] = [];
    for (let index = preFlag; index < data.length; index++) {
      if (index === preFlag) {
        keymap = Object.values(data[index]);
      } else if (index > preFlag + 1) {
        const curRow = Object.values(data[index]);
        if (curRow.length === 6) {
          const chanel: any = curRow[1];
          let curdata: any = {};
          keymap.forEach((x, i) => {
            curdata[x] = curRow[i];
          });
          transformedData[k][chanel] = transformedData[k][chanel] || [];
          transformedData[k][chanel].push(curdata);
        } else {
          break;
        }
      }
    }
  };

  ["数据概况", "阅读转化", "推荐转化", "性别分布"].forEach(commonTransfer);

  ["年龄分布", "地域分布"].forEach(commonTransfer2);

  commomTransfer3("数据趋势明细");

  return transformedData;
};

export const cleanMainText = (htmlTextContent: string) => {
  return convert(htmlTextContent);
};

export const getSubscription = (textContent: string) => {
  return new Promise(async (resolve, reject) => {
    GM_xmlhttpRequest({
      url: "https://api.moonshot.cn/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "",
      },
      data: JSON.stringify({
        model: "moonshot-v1-8k",
        messages: [
          {
            role: "system",
            content:
              "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。",
          },
          {
            role: "user",
            content: `请从归纳以下文案的主要内容，并提供3-5条关键字：'${textContent}'`,
          },
        ],
        temperature: 0.3,
      }),
      onload(res) {
        console.log(res);
      },
      onerror(e) {
        console.log(e);
      },
    });
  });
};

// ! sk-iDXUBaIv0t2QyXG3XILjofKfJYH9NcJTvwArSJ6t9qnP9ruK
// curl https://api.moonshot.cn/v1/chat/completions \
//     -H "Content-Type: application/json" \
//     -H "Authorization: sk-iDXUBaIv0t2QyXG3XILjofKfJYH9NcJTvwArSJ6t9qnP9ruK" \
//     -d '{
//         "model": "moonshot-v1-8k",
//         "messages": [
//             {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
//             {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"}
//         ],
//         "temperature": 0.3
//    }'
