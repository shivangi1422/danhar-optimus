import {
  div, a, p, h3,
  article,
} from '../../scripts/dom-builder.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { formatDate, formatDateRange } from '../../scripts/scripts.js';

async function fetchPostData() {
  try {
    const response = await fetch('/drafts/query-index.json');
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData.data;
  } catch (error) {
    return [];
  }
}

async function generateEventDetails(articles) {
  console.log(articles);
  const articleElements = articles.map((art) => {
    console.log(art.date);
    return article(
      { class: 'item' },
      div(
        { class: 'image' },
        a({
          href: art.path,
          title: art.title,
        }, createOptimizedPicture(art.image, art.title)),
      ),
      div(
        { class: 'content' },
        p({ class: 'cite' }, formatDateRange(art.date)),
        p({ class: 'cite' }, formatDate(art.lastModified)),
        p(
          a({
            class: 'title',
            title: art.title,
            href: art.path,
          }, capitalizeWords(art.title)),
        ),
        ul(
          { class: 'keyword-list' },
          li({ class: 'item' }, art.type),
          li({ class: 'item' }, art.address !== art.region ? art.address : art.region),
          (art.address !== art.region ? li({ class: 'item' }, art.region) : ''),
        ),
      ),
    );
  });
  return articleElements;
}

export default async function decorate(block) {
  const postData = await fetchPostData();
  const wrapper = div({ class: 'content' });
  const productContainer = div({ class: 'products-list' });
  let sortedResults = [];
  const filteredResults = postData.filter((item) => item.path.includes('/products'));
  console.log(filteredResults);
  console.log(filteredResults.date);
  if (filteredResults.length) {
    sortedResults = filteredResults.sort((ar1, ar2) => ar2.date - ar1.date);
  }
  const container = generateEventDetails(filteredResults);
}
