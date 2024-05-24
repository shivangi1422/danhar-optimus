import { getMetadata } from '../../scripts/aem.js';
import { div, h2 } from '../../scripts/dom-builder.js';

export default async function buildAutoBlocks(block) {
  const title = getMetadata('og:title');
  const description = getMetadata('og:description');

  const headTitle = div(
    { class: 'head-section' },
    h2({ class: 'title' }, title),
    div({ class: 'description' }, description),
  );

  const contentBlocks = block.querySelectorAll('.section');

  // Creating the default template wrapper
  const defaultTemplate = document.createElement('div');
  defaultTemplate.id = 'content-wrapper';

  // Creating content wrapper
  const content = document.createElement('div');
  content.id = 'content';

   // Creating outer element
   const outerElement = document.createElement('div');
   outerElement.className = 'outer';

  // Creating main and sidebar elements
  const main = document.createElement('div');
  main.id = 'main';
 
  outerElement.appendChild(headTitle);
  outerElement.appendChild(main);
  content.appendChild(outerElement);
  contentBlocks.appendChild(content);
  block.appendChild(contentBlocks);
}
