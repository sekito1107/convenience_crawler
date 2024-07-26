import puppeteer from "puppeteer";
import NewProduct from "./NewProduct.js";

export default class Scraper {
  static URLS = {
    Lawson: "https://www.lawson.co.jp/recommend/new/",
    SevenEleven: (region) =>
      `https://www.sej.co.jp/products/a/thisweek/area/${region}/1/l100/`,
    FamilyMart: "https://www.family.co.jp/goods/newgoods.html",
  };

  static TAGS = {
    Lawson: {
      main: "ul.col-3.heightLineParent li",
      name: "p.ttl",
      date: ".date span",
      price: "p.price",
    },
    SevenEleven: {
      main: "[class^='list_inner']",
      name: ".item_ttl a",
      date: ".item_launch p",
      price: ".item_price p",
    },
    FamilyMart: {
      main: ".ly-mod-layout-clm",
      name: "h3.ly-mod-infoset3-ttl",
      price: "p.ly-mod-infoset3-txt",
    },
  };

  static async allStoreNewProducts(stores, region) {
    let result = {};
    const browser = await puppeteer.launch();
    try {
      for (const store of stores) {
        result[store] = await this.#storeNewProducts(browser, store, region);
      }
    } catch (error) {
      console.error("Error in stores method:", error);
    } finally {
      await browser.close();
    }
    return result;
  }

  static async #storeNewProducts(browser, storeName, region = null) {
    const page = await browser.newPage();
    const url =
      storeName === "SevenEleven"
        ? Scraper.URLS[storeName](region)
        : Scraper.URLS[storeName];
    const tags = Scraper.TAGS[storeName];

    try {
      await page.goto(url);
      await page.waitForSelector(tags.main);

      const newProducts = await page.evaluate((tags) => {
        // eslint-disable-next-line no-undef
        const items = document.querySelectorAll(tags.main);
        return Array.from(items).map((item) => {
          const name =
            item.querySelector(tags.name)?.textContent.trim() ||
            "公式サイトを確認してください";
          const date =
            item.querySelector(tags.date)?.textContent.trim() ||
            "詳細な発売日は公式サイトを確認してください";
          const price =
            item.querySelector(tags.price)?.textContent.trim() ||
            "詳細な値段は公式サイトを確認してください";
          return { name, date, price };
        });
      }, tags);

      return newProducts.map(
        (product) => new NewProduct(product.name, product.date, product.price)
      );
    } catch (error) {
      console.error(`データの取得に失敗しました ${storeName}:`, error);
      return [];
    } finally {
      await page.close();
    }
  }
}
