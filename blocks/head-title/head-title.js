export default function decorate(block) {
  // console.log(block);
  [...block.children].forEach((row) => {
    // row.classList.add("head-title");
    [...row.children].forEach((elements) => {
      if (elements.children.length === 1 && elements.querySelector('p')) {
        elements.className = 'navigation-description';
      } else {
        elements.className = 'head-title';
      }
    });
  });
}
