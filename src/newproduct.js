import puppeteer from "puppeteer";
import chalk from "chalk";
import lodash from "lodash";

export default class NewProduct {
  static URL_MAP = {
    lawson: "https://www.lawson.co.jp/recommend/new/",
    seven: (region) =>
      `https://www.sej.co.jp/products/a/thisweek/area/${region}/1/l100/`,
    family: "https://www.family.co.jp/goods/newgoods.html",
  };

  static TAG_MAP = {
    lawson: "ul.col-3.heightLineParent li p.ttl",
    seven: "div.item_ttl p",
    family: "h3.ly-mod-infoset3-ttl",
  };

  static async build(options, region) {
    const newProduct = new NewProduct();
    newProduct.options = options;
    newProduct.region = region;
    newProduct.browser = await puppeteer.launch();
    newProduct.lawson = await newProduct.handleScrape(
      newProduct.needsStore("-l"),
      NewProduct.URL_MAP.lawson,
      NewProduct.TAG_MAP.lawson
    );
    newProduct.seven = await newProduct.handleScrape(
      newProduct.needsStore("-s"),
      NewProduct.URL_MAP.seven(region),
      NewProduct.TAG_MAP.seven
    );
    newProduct.family = await newProduct.handleScrape(
      newProduct.needsStore("-f"),
      NewProduct.URL_MAP.family,
      NewProduct.TAG_MAP.family
    );
    return newProduct;
  }

  needsStore(option) {
    return this.options.length === 0 || this.options.includes(option);
  }

  async handleScrape(order, url, tag) {
    if (order) {
      const result = await this.scrape(url, tag);
      return result;
    }
    return null;
  }

  async scrape(url, tag) {
    const page = await this.browser.newPage();
    try {
      await page.goto(url);
      await page.waitForSelector(tag);
      const result = await page.$$eval(tag, (elements) =>
        elements.map((element) => element.textContent)
      );
      return result;
    } catch (error) {
      console.error(`以下のアドレスでデータの取得に失敗しました ${url}`, error);
      return null;
    } finally {
      await page.close();
    }
  }

  fullText() {
    let result = lodash.compact([
      this.storeText("Lawson", this.lawson),
      this.storeText("SevenEleven", this.seven),
      this.storeText("FamilyMart", this.family),
    ]);
    return result.join("\n");
  }

  storeText(storeName, newProducts) {
    if (newProducts) {
      let result = `${chalk.green(storeName)}\n\n`;
      result += newProducts.join("\n");
      return result;
    }
    return "";
  }
}
