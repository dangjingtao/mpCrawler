import style from "../styles/global.module.css";
import logo from "../images/logo.svg";
import btnStyle from "../styles/button.css";
import cover from "../images/cover.jpg";
import dayjs from "dayjs";
import cn from "classnames";
import { imageToText, getImageData } from "char-dust";
import { Log } from "../lib";
import CONFIG from "../flow/CONFIG";
const { ARTICLE_LIST_KEY, ARTICLE_FINISHED_FLAG } = CONFIG.global;

class Modal {
  _onAction: Function;
  logger: any;
  modalContainer!: HTMLDivElement;
  onExport: any;
  constructor(options: { onAction: Function; onExport: Function }) {
    this._onAction = options.onAction;
    this.onExport = options.onExport;
    this.logger = new Log();
  }

  init() {
    this.initModalDOM();
    this.initModalEvent();
  }

  async onAction(...args: any) {
    return await this._onAction(...args);
  }

  initModalDOM() {
    const $mask = $(document.createElement("div"));
    $mask.attr("id", "mpMask").addClass(style.mpMask);
    const modal = document.createElement("div");
    this.modalContainer = modal;

    const $modal = $(modal);
    $modal.attr("id", "mpModal");
    $modal.addClass(style.modal);
    $modal.hide();
    $modal.html(`
      <a id="modalClose" class="${style.modalClose}">X</a>
      <h2 class="${style.modalTitle}">
        <div>
          <img src="${logo}"><span>MP Crawler</span><span style="font-size:18px;display:inline-block;padding-top:8px;">${__VERSION__}</span>
        </div>
      </h2>
      <div class="${style.modalBody}">
        <div class="${style.modalForm}">
          <span>选择日期范围&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <input 
          type="date"
          id="mpStartDate" 
          class="${style.datePicker}"
          max="${dayjs().format("YYYY-MM-DD")}"
          />
          &nbsp;&nbsp;-&nbsp;&nbsp;
          <input
          type="date"
          id="mpEndDate" 
          disabled="true"
          max="${dayjs().format("YYYY-MM-DD")}"
          class="${style.datePicker}"  />&nbsp;&nbsp;&nbsp;&nbsp;
          <button
              id="mpCrawl"
              class="${cn(btnStyle.button, btnStyle.small, btnStyle.blue)}"
              disabled="true" >爬取</button>
            &nbsp;&nbsp;&nbsp;&nbsp; 
            <button
              id="mpExport"
              class="${cn(btnStyle.button, btnStyle.small, btnStyle.green)}" 
              disabled="true">导出</button>
        </div>
        <div class="${style.mpMore}">
          <div id="mpConsole" class="${style.mpConsole}">
            <pre id="mpBoot" style="line-height:1.42;font-size:10px;width:913px;height:329px;margin:0 auto;letter-spacing: 0.05rem;"></pre>
          </div>          
        </div>
      </div>
        
      <div class="${style.modalFooter}">
          Copyright © 2024 <a target="_blank" href="https://github.com/dangjingtao/mpCrawler">Tomz Dang</a>
       </div>
    `);
    $("body").append($mask).append($modal).css("overflow", "hidden");
  }

  initBoot() {
    const coverImg = new Image(800, 309); //0.0.386
    coverImg.src = cover;
    coverImg.onload = () => {
      const imageData = getImageData(coverImg);
      const text = imageToText(imageData);
      const animate = async (arr: string[] = text, i = 0) => {
        if (arr[i]) {
          const l = arr[i] + "\n";
          return new Promise((resolve, reject) => {
            var tm = setTimeout(() => {
              const preText = $("#mpBoot").text();
              i > 1 && $("#mpBoot").text(preText + l);
              clearTimeout(tm);
              return animate(arr, i + 1);
            }, 60);
          });
        } else {
          return;
        }
      };
      animate();
    };
  }

  initModalEvent() {
    $("#modalClose").on("click", this.remove);

    $("#mpStartDate").on("change", (e: any) => {
      $("#mpEndDate").attr("disabled", null).attr("min", e.target.value);
    });

    $("#mpEndDate").on("change", (e: any) => {
      $("#mpStartDate").attr("max", e.target.value);
      $("#mpCrawl").attr("disabled", null);
    });

    $("#mpCrawl").on("click", async () => {
      GM_setValue("mpArticleList", []);
      const startDate = $("#mpStartDate").val();
      const endDate = $("#mpEndDate").val();
      $("#mpCrawl").hide();
      $("#modalClose").hide();
      await this.onAction({ startDate, endDate });
      $("#modalClose").show();
      $("#mpExport").removeAttr("disabled");
    });

    $("#mpExport").on("click", this.onExport);

    // this.initBoot();
  }

  show() {
    GM_setValue(ARTICLE_LIST_KEY, null);
    GM_setValue(ARTICLE_FINISHED_FLAG, false);
    this.init();
    $("#mpModal").fadeIn(100);
    this.initBoot();
  }

  remove() {
    GM_setValue(ARTICLE_LIST_KEY, null);
    GM_setValue(ARTICLE_FINISHED_FLAG, false);

    $("#mpModal").fadeOut(100, () => {
      $("#mpModal").hide(() => {
        $("#mpModal").remove();
        $("#mpMask").hide().remove();
        $("body").css("overflow", "auto");
        $("#mpModal").find("*").off();
        this.logger = null;
      });
    });
  }
}

export default Modal;
