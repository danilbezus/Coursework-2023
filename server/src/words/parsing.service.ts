import { JSDOM } from 'jsdom';

const getPage = (word: string) => {
  const site = process.env.parsingSite;
  const request = `${site}${word}`;
  return fetch(request)
    .then((response) => response.text())
    .then((data) => {
      const dom = new JSDOM(data);
      const definition = dom.window.document
        .getElementsByClassName('sense-block pr dsense dsense-noh')[0]
        .getElementsByClassName('sense-body dsense_b')[0]
        .getElementsByClassName('def-body ddef_b ddef_b-t')[0]
        .getElementsByTagName('span')[0].innerHTML;
      return definition;
    })
    .catch((error) => {
      console.log(error);
    });
};

getPage('word')
  .then((definition) => {
    console.log(definition);
  })
  .catch((error) => {
    console.log(error);
  });
