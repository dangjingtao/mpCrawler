type LogType = "info" | "warn" | "success" | "error" | string;
type EventObject = {
  [K in LogType]?: Function[];
};

export class Log {
  eventObject: EventObject;
  infoTypes: {
    log: { color: string };
    info: { color: string };
    warn: { color: string };
    error: { color: string };
    success: { color: string };
  };
  onLogStart?: Function;
  constructor() {
    this.infoTypes = {
      log: { color: "rgb(39,39,39)" },
      info: { color: "rgb(66,153,244)" },
      warn: { color: "rgb(251,188,5)" },
      error: { color: "rgb(234,67,53)" },
      success: { color: "rgb(52,168,83)" },
    };
    this.eventObject = {};
    Object.entries(this.infoTypes).forEach(([key, value]) => {
      this.eventObject[key] = [
        (message: string) => {
          this._createPara(value.color, `<b>[${key}]</b> ${message}`);
        },
      ];
    });
  }

  _smoothScroll(id: string) {
    const element = $(id);
    element.stop().animate(
      {
        scrollTop: element.prop("scrollHeight"),
      },
      500
    );
  }

  _createPara(color: string, message: string) {
    this.onLogStart && this.onLogStart();
    $("#mpBoot").hide();
    const line = document.createElement("p");
    line.style.color = color;
    line.style.paddingLeft = "10px";
    line.innerHTML = message;
    $("#mpConsole").append(line);
    this._smoothScroll("#mpConsole");
  }

  async publish(logType: LogType, message: String) {
    // 取出当前事件所有的回调函数
    const callbackList = this.eventObject[logType];

    if (!callbackList) return console.warn(`${logType} not found`);
    //

    for (let callback of callbackList) {
      await callback(message);
    }
  }

  subscribe(logType: LogType, callback?: Function) {
    this.eventObject[logType] = this.eventObject[logType] || [];

    if (typeof callback === "function") {
      this.eventObject[logType]!.push(callback || function () {});
    }
  }

  async info(msg: string) {
    return await this.publish("info", msg);
  }

  async warn(msg: string) {
    return await this.publish("warn", msg);
  }

  async error(msg: string) {
    return await this.publish("error", msg);
  }

  async success(msg: string) {
    return await this.publish("success", msg);
  }

  async log(msg: string) {
    return await this.publish("log", msg);
  }
}
