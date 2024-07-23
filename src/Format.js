import chalk from "chalk";

export default class Format {
  static result(newProducts) {
    return Object.entries(newProducts)
      .map(([store, items]) => {
        const storeHeader = chalk.bold.green(`${store}`);
        const itemsText = items
          .map((item) => Format.#formatProduct(item))
          .join("\n");
        const separator =
          "------------------------------------------------------------------------------------------";

        return `${storeHeader}\n${separator}\n${itemsText}\n${separator}`;
      })
      .join("\n");
  }

  static #formatProduct(product) {
    const name = this.#productName(product.name);
    return `${name}\n${product.price} ${product.date}`;
  }

  static #productName(str) {
    return chalk.bold.blue(str);
  }
}
