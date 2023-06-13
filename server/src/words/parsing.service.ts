import { JSDOM } from 'jsdom';

class ParsingService {
  async getPage(word: string): Promise<string> {
    const site = process.env.PARSINGSITE;
    const request = `${site}${word}`;

    try {
      const response = await fetch(request);
      const data = await response.text();
      const dom = new JSDOM(data);
      const definition =
        dom.window.document.getElementsByClassName('trans dtrans')[0].innerHTML;
      return definition;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const parsingService = new ParsingService();
parsingService
  .getPage('word')
  .then((definition) => {
    console.log(definition);
  })
  .catch((error) => {
    console.log(error);
  });
