import readline from "readline";
import Scraper from "./scraper.js";
import Format from "./format.js";

export default class App {
  static TARGET_STORES = ["Lawson", "SevenEleven", "FamilyMart"];

  static REGIONS = {
    a: "hokkaido",
    b: "tohoku",
    c: "kanto",
    d: "koshinetsu",
    e: "hokuriku",
    f: "tokai",
    g: "kinki",
    h: "chugoku",
    i: "shikoku",
    j: "kyushu",
    k: "okinawa",
  };

  async init() {
    this.options = process.argv.slice(2);
    this.targetStores = this.targetStores(this.options);
    this.newProducts = await Scraper.stores(
      this.targetStores,
      await this.inputRegion()
    );
  }

  targetStores(options) {
    if (this.options.length === 0) {
      return App.TARGET_STORES;
    } else {
      return App.TARGET_STORES.filter((store) =>
        options.some((option) => store.toLowerCase().startsWith(option))
      );
    }
  }

  static async run() {
    const app = new App()
    await app.init()
    console.log(Format.result(app.newProducts));
  }

  async inputRegion() {
    if (this.options.length !== 0 && !this.options.includes("-s")) {
      return Promise.resolve();
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(
        "地域を選択してください(セブンイレブンのみ適用) a:北海道 b:東北 c:関東 d:甲信越 e:北陸 f:東海 g:近畿 h:中国 i:四国 j:九州 k:沖縄\n",
        (input) => {
          rl.close();
          const result = this.convertRegion(input);
          resolve(result);
        }
      );
    });
  }

  convertRegion(input) {
    return App.REGIONS[input] || "kanto";
  }
}
