import {
  span, div, a, button, h4, ul, li,
} from '../../scripts/dom-builder.js';
import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// const baseURL = getCommerceBase();
function showFlyoutMenu() {
  document.querySelector('#menu-flyout')?.classList.remove('hidden');
}

function hideFlyoutMenu() {
  document.querySelector('#menu-flyout')?.classList.add('hidden');
}

function sortFlyoutMenus(menuPath) {
  const menuList = document.querySelector('#menu-flyout ul');
  const heading = menuPath.split('|');
  if (heading) document.querySelector('#menu-flyout h4').textContent = heading[heading.length - 1];
  [...menuList.children].forEach((menu) => {
    if (menu.getAttribute('data-content') !== menuPath && menu.getAttribute('data-content') !== menuPath) {
      menu.classList.add('hidden');
    } else {
      menu.classList.remove('hidden');
      const href = menu.getAttribute('data-href');
      const backFlyout = document.querySelector('#back-flyout');
      const exploreFlyout = document.querySelector('#explore-flyout');
      const redirectLink = menu.getAttribute('data-content').split('|').slice(0, -1).join('|');
      if (redirectLink) {
        backFlyout.setAttribute('data-redirect', redirectLink);
        backFlyout.classList.remove('hidden');
      } else backFlyout.classList.add('hidden');
      if (href) {
        exploreFlyout.setAttribute('href', href);
        exploreFlyout.classList.remove('hidden');
      } else exploreFlyout.classList.add('hidden');
    }
  });
}

function buildLogosBlock(headerBlock) {
  const logoHtmlBlock = headerBlock.children[0];
  console.log(logoHtmlBlock);
  logoHtmlBlock.classList.add('bg-danahergray-150 hidden lg:block');
  const logoUl = logoHtmlBlock.querySelector('ul');
  logoUl.className = 'h-14 flex justify-center';
  const logoLis = logoUl.querySelectorAll(':scope > li');
  logoLis.forEach((logoLi) => {
    logoLi.className = 'group md:mx-5 mx-10';
    const logoLink = logoLi.querySelector(':scope > a');
    const logoPicture = logoLi.querySelector(':scope > picture');
    const logoImg = logoPicture.querySelector('img');
    logoImg.className = 'h-7 w-auto px-4';
    const logoTitle = logoLink.textContent;
    logoImg.setAttribute('alt', logoTitle);
    logoImg.setAttribute('style', 'filter: brightness(0) invert(1);');
    logoLink.textContent = '';
    logoLink.className = 'h-full flex items-center group-hover:bg-danahergray-200';
    logoLink.append(logoPicture);
    logoLi.innerHTML = '';
    logoLi.append(logoLink);
  });
}

function buildNavBlock(headerBlock) {
  const extendedSectionBlock = headerBlock.querySelector('div.extended-section');
  const menuLinks = [];
  [...headerBlock.children].slice(2).forEach((menuItemEl) => {
    menuItemEl.className = menuItemEl.innerHTML ? 'menu-flyout hidden' : '';
    if (menuItemEl.querySelector(':scope > p')?.textContent === 'Menu') {
      menuItemEl.querySelectorAll(':scope > ul > li').forEach((childMenuItem) => {
        menuLinks.push(childMenuItem);
      });
    }
  });
  const navHtmlBlock = div({ class: 'mega-menu-off-scroll hidden lg:flex items-center gap-x-4' });

  // home link
  const homeLink = a({ class: 'hidden lg:flex text-danaherpurple-500 hover:text-danaherpurple-800 lifesciences-logo-link font-semibold', href: '/' }, 'Life Sciences');

  // main nav
  navHtmlBlock.append(homeLink);
  menuLinks.forEach((item) => {
    const menuItemName = item.innerText;
    const expandIcon = item.querySelector('span.icon-arrow-right');
    const menuItemEl = a(
      {
        class: 'btn relative bg-transparent hover:bg-transparent text-black font-medium ring-0 border-0 ring-offset-0 group',
        href: item.querySelector('a')?.href || '#',
      },
      menuItemName,
    );
    if (expandIcon) {
      menuItemEl.append(span({ class: 'icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 transition group-hover:rotate-180 ml-1' }));
      menuItemEl.addEventListener('click', (e) => {
        e.preventDefault();
        showFlyoutMenu();
        sortFlyoutMenus(`Menu|${menuItemName}`);
      });
    }
    navHtmlBlock.append(menuItemEl);
  });
  extendedSectionBlock.append(navHtmlBlock);
}

function buildFlyoutMenus(headerBlock) {
  const allFlyout = headerBlock.querySelectorAll('.menu-flyout');
  const closeFlyout = button({ class: 'flex ml-auto mx-2 p-1 rounded hover:bg-gray-200/30' }, span({ class: 'icon icon-x w-6 h-6 [&_svg>use]:stroke-2 [&_svg>use]:stroke-gray-500/70' }));
  closeFlyout.addEventListener('click', hideFlyoutMenu);

  const backFlyout = button({ id: 'back-flyout', class: 'flex items-center gap-x-1 group' }, span({ class: 'icon icon-arrow-left [&_svg>use]:stroke-danaherpurple-500 w-4 h-4 transition-transform group-hover:translate-x-0.5' }), 'Back');
  backFlyout.addEventListener('click', () => sortFlyoutMenus(backFlyout.getAttribute('data-redirect')));

  const exploreFlyout = a({ id: 'explore-flyout', class: 'flex items-center gap-x-1 group', href: '#' }, 'Explore all', span({ class: 'icon icon-arrow-right [&_svg>use]:stroke-danaherpurple-500 w-4 h-4 transition-transform group-hover:-translate-x-0.5' }));

  const navigateActions = div(
    { class: 'flex justify-between text-base text-danaherpurple-500 font-bold mx-2' },
    backFlyout,
    exploreFlyout,
  );

  decorateIcons(closeFlyout);
  decorateIcons(backFlyout);
  decorateIcons(exploreFlyout);

  const menuWrapper = ul({ class: 'h-full flex flex-col gap-y-2 mt-3 overflow-auto [&>li.active]:bg-danaherpurple-50 [&>li.active]:font-bold' });
  [...allFlyout].forEach((flyMenu) => {
    const contentText = flyMenu.children[0]?.textContent;
    const anchorHref = flyMenu.children[0].querySelector('a')?.href;

    [...flyMenu.children[1].children].map((flyMenuChild) => {
      const contextPath = `${contentText}|${flyMenuChild.textContent}`;
      const liTag = li(
        {
          class: 'inline-flex justify-between items-center hover:bg-danaherpurple-50 font-extralight text-base hover:font-medium tracking-wider px-2 py-2 select-none cursor-pointer [&>a]:w-full transition group',
          'data-content': contentText,
          ...(anchorHref && { 'data-href': anchorHref }),
        },
      );
      if (flyMenuChild.querySelector('span.icon')) {
        liTag.setAttribute('data-redirect', contextPath);
        liTag.innerHTML += flyMenuChild.textContent;
        liTag.append(span({ class: 'icon icon-arrow-right shrink-0 [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-black w-4 h-4 group-hover:-translate-x-0.5' }));
        liTag.addEventListener('click', () => sortFlyoutMenus(contextPath));
      } else liTag.append(a({ href: flyMenuChild.querySelector('a')?.href }, flyMenuChild.textContent));
      decorateIcons(liTag);
      menuWrapper.append(liTag);
      return flyMenuChild;
    });
    flyMenu.outerHTML = '';
  });

  const flyout = div(
    {
      id: 'menu-flyout',
      class: 'w-full hidden fixed top-0 left-0 z-40 h-screen transition-all ease-out backdrop-brightness-50',
    },
    div(
      { class: 'w-[360px] max-w-sm fixed h-full bg-white px-3 py-4 ease-out transition-all' },
      closeFlyout,
      h4({ class: 'text-2xl font-medium text-gray-900 mt-0 mx-2 mb-2' }, 'Flyout Menu Heading'),
      navigateActions,
      div({ class: 'border-b border-black py-2 mx-2' }),
      menuWrapper,
    ),
  );
  flyout.addEventListener('click', (event) => {
    if (event.target.id === 'menu-flyout') hideFlyoutMenu();
  });
  return flyout;
}

function handleScroll() {
  const stickyHeader = document.getElementById('sticky-header');
  const hamburgerIcon = document.getElementById('nav-hamburger');
  const extendedSection = document.getElementById('extended-section');
  const megaMenus = stickyHeader.querySelector('.mega-menu-off-scroll');
  const brandLogo = stickyHeader.querySelector('.brand-logo');
  if (window.scrollY >= 95) {
    stickyHeader.classList.add('remove-descedents', 'fixed', 'inset-x-0', 'top-0', 'w-full', 'lg:!pb-4', 'shadow-lg');
    stickyHeader.firstElementChild.classList.add('bg-white');
    hamburgerIcon?.classList.remove('lg:hidden');
    hamburgerIcon?.classList.add('lg:block');
    extendedSection?.classList.remove('lg:lg:grid-rows-2');
    extendedSection?.classList.add('lg:lg:grid-rows-1');
    megaMenus?.classList.remove('lg:block');
    megaMenus?.classList.add('lg:hidden');
    brandLogo?.classList.remove('h-full');
    brandLogo?.classList.add('h-10');
  } else if (window.scrollY < 95) {
    stickyHeader.classList.remove('remove-descedents', 'fixed', 'inset-x-0', 'top-0', 'w-full', 'lg:!pb-4', 'shadow-lg');
    stickyHeader.firstElementChild.classList.remove('bg-danaherblue-600');
    hamburgerIcon?.classList.add('lg:hidden');
    hamburgerIcon?.classList.remove('lg:block');
    extendedSection?.classList.remove('lg:lg:grid-rows-1');
    extendedSection?.classList.add('lg:lg:grid-rows-2');
    megaMenus?.classList.remove('lg:hidden');
    megaMenus?.classList.add('lg:block');
    brandLogo?.classList.remove('h-10');
    brandLogo?.classList.add('h-full');
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  // const resp = await fetch('/fragments/header/master.plain.html');

  const html = fragment.contentText;

  // build header DOM
  const headerBlock = div({ class: 'nav-container pt-0 pb-0 md:p-0 bg-danaherpurple-800 relative z-20' });
  headerBlock.innerHTML = html;
  buildLogosBlock(headerBlock);
  // buildSearchBlock(headerBlock);
  buildNavBlock(headerBlock);
  const flyout = buildFlyoutMenus(headerBlock);

  decorateIcons(headerBlock);

  window.addEventListener('scroll', handleScroll);
  block.innerHTML = '';
  block.append(headerBlock);
  block.append(flyout);

  return block;
}
