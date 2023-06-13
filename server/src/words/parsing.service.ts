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
          translation: elements[i].getElementsByClassName('trans dtrans')[0]
            ? elements[i].getElementsByClassName('trans dtrans')[0].innerHTML
            : '-',
          definition: elements[i].getElementsByClassName('def ddef_d db')[0]
            ? elements[i]
                .getElementsByClassName('def ddef_d db')[0]
                .textContent.trim()
            : '-',
          example: elements[i].getElementsByClassName('examp dexamp')[0]
            ? elements[i]
                .getElementsByClassName('examp dexamp')[0]
                .textContent.trim()
            : '-',
          pronunciation: dom.window.document.getElementsByClassName(
            'ipa dipa',
          )[0]
            ? dom.window.document.getElementsByClassName('ipa dipa')[0]
                .innerHTML
            : '-',
          partsOfSpeech: elements[i]
            .closest('.link.dlink')
            .getElementsByClassName('pos dpos')[0]
            ? elements[i]
                .closest('.link.dlink')
                .getElementsByClassName('pos dpos')[0].innerHTML
            : '-',
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
