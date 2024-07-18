import readline from "readline";
import NewProduct from "./newproduct.js";

export default class App {
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
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.newProduct = await NewProduct.build(
      this.options,
      await this.inputRegion(),
    );
  }

  async run() {
    console.log(this.newProduct.fullText());
    this.readline.close();
    await this.newProduct.browser.close();
  }

  async inputRegion() {
    if (this.options.length !== 0 && !this.options.includes("-s")) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.readline.question(
        "地域を選択してください(セブンイレブンのみ適用) a:北海道 b:東北 c:関東 d:甲信越 e:北陸 f:東海 g:近畿 h:中国 i:四国 j:九州 k:沖縄\n",
        (input) => {
          const result = this.convertRegion(input);
          resolve(result);
        },
      );
    });
  }

  convertRegion(input) {
    return this.REGIONS[input] || "kanto";
  }
}
