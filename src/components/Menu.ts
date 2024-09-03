import { debounce } from "../lib";
import style from "../styles/global.module.css";
import logo from "../images/logo.svg";

class Menu {
  menuContainer!: HTMLDivElement;
  onClick: any;
  constructor(options: { onClick: Function }) {
    this.onClick = options.onClick;
  }
  init() {
    this.initDOM();
    this.initEvent();
  }
  initDOM() {
    const menuContainer = document.createElement("div");
    menuContainer.id = "mpCrawler";
    menuContainer.classList.add(style.menuContainer);
    const logoImage = document.createElement("img");
    logoImage.setAttribute("src", logo);
    logoImage.classList.add(style.logo);
    const actionButton = document.createElement("a");
    actionButton.classList.add(style.actionButton);
    actionButton.innerText = "MPC";
    menuContainer.appendChild(logoImage);
    menuContainer.appendChild(actionButton);
    document.body.appendChild(menuContainer);
    this.menuContainer = menuContainer;
  }
  initEvent() {
    const { menuContainer } = this;
    menuContainer.addEventListener(
      "mouseover",
      debounce(() => {
        menuContainer.classList.add(style.menuContainerHover);
      }, 10)
    );
    menuContainer.addEventListener(
      "mouseout",
      debounce(() => {
        menuContainer.classList.remove(style.menuContainerHover);
      }, 10)
    );
    menuContainer.addEventListener("click", this.onClick);
  }
}

export default Menu;
