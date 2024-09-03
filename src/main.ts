import Menu from "./components/Menu";
import Modal from "./components/Modal";
import { fetchArticleListPage } from "./flow/getData";
import { exportArticles } from "./flow/export";
import { getQueryStringByKey } from "./lib";
import config from "./config";

// ! 域名 cookie判断
const mpMenu = new Menu({
  onClick: () => {
    if (!document.querySelector("#mpModal")) {
      const mpModal = new Modal({
        onAction: fetchArticleListPage,
        onExport: exportArticles,
      });
      mpModal.show();
    }
  },
});

const testUrl = () => {
  const host = window.location.host;
  const path = window.location.pathname;
  const token = getQueryStringByKey("token");
  return config.global.host === host && !!token;
};

if (testUrl()) {
  mpMenu.init();
}
