import { getMetadata } from '../../scripts/aem.js';
import { div, h1 } from '../../scripts/dom-builder.js';

function setSidebarMaxHeight() {
  let height = 0;
  const sidebar = document.querySelector('.sticky-right-navigation');
  [...sidebar.children].forEach((element) => {
    height += element.offsetHeight;
  });
  sidebar.style.maxHeight = `${height + 50}px`;
}

function setSidebarHeight() {
  window.addEventListener('resize', setSidebarMaxHeight);
  window.addEventListener('click', setSidebarMaxHeight);
}

export default function buildAutoBlocks(block) {
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

  const sidebar = document.createElement('div');
  sidebar.id = 'sidebar';

  const title = getMetadata('og:title');
  const description = getMetadata('og:description');

  const headTitle = div(
    { class: 'header-section' },
    div(
      { class: 'head-section' },
      h1({ class: 'title' }, title),
      div({ class: 'border' }),
      div({ class: 'description' }, description),
    ),
  );

  content.append(headTitle);

  // Iterate over each section
  contentBlocks.forEach((blocks) => {
    // Handling sidebars within each section
    const sidebars = blocks.querySelectorAll('[data-block-name^="sticky-right-navigation"]');
    if (sidebars.length > 0) {
      sidebars.forEach((sidebarItem) => {
        sidebar.appendChild(sidebarItem); // Clone to keep the original in place
      });
    }

    main.appendChild(blocks);
    blocks.style.display = null;
  });

  // Creating clearfix element
  const clearFix = document.createElement('div');
  clearFix.className = 'clearfix';

  outerElement.appendChild(main);
  outerElement.appendChild(sidebar);
  if (!sidebar.children.length > 0) {
    document.body.classList.add('full-width');
  }
  content.appendChild(outerElement);
  content.appendChild(clearFix);
  defaultTemplate.appendChild(content);
  block.appendChild(defaultTemplate);
  const observer = new MutationObserver(() => {
    setSidebarMaxHeight();
  });
  observer.observe(sidebar, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
  setTimeout(() => setSidebarMaxHeight(), 1000);
  setSidebarHeight();
}
