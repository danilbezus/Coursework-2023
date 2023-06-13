import { JSDOM } from 'jsdom';
import * as dotenv from 'dotenv';

dotenv.config();

const site = process.env.PARSINGSITE;

export default class ParsingService {
  async getPage(word: string): Promise<object> {
    const request = `${site}${word}`;

    try {
      const response = await fetch(request);
      const data = await response.text();
      const dom = new JSDOM(data);
      const elements = dom.window.document.getElementsByClassName(
        'sense-block pr dsense dsense-noh',
      );
      const max = elements.length;
      const wordOptions = {};
      for (let i = 0; i < max; i++) {
        const wordOption = {
          translation:
            dom.window.document.getElementsByClassName('trans dtrans')[i]
              .innerHTML,
          definition: dom.window.document
            .getElementsByClassName('def ddef_d db')
            [i].textContent.trim(),
          example: dom.window.document
            .getElementsByClassName('examp dexamp')
            [i].textContent.trim(),
          pronunciation:
            dom.window.document.getElementsByClassName('ipa dipa')[0].innerHTML,
          partsOfSpeech: elements[i]
            .closest('.link.dlink')
            .getElementsByClassName('pos dpos')[0].innerHTML,
        };

        wordOptions['wordOption' + i] = wordOption;
      }
      return wordOptions;
    } catch (error) {
      console.error();
      throw error;
    }
  }
}
