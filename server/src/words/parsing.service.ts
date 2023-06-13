import { JSDOM } from 'jsdom';

const site = process.env.PARSINGSITE;

export default class ParsingService {
  async getPage(
    word: string,
  ): Promise<{ definition: string; example: string; pronunciation: string }> {
    const request = `${site}${word}`;

    try {
      const response = await fetch(request);
      const data = await response.text();
      const dom = new JSDOM(data);

      const definition =
        dom.window.document.getElementsByClassName('trans dtrans')[0].innerHTML;
      const example = dom.window.document
        .getElementsByClassName('examp dexamp')[0]
        .textContent.trim();
      const pronunciation =
        dom.window.document.getElementsByClassName('ipa dipa')[0].innerHTML;

      return { definition, example, pronunciation };
    } catch (error) {
      console.error();
      throw error;
    }
  }
}
