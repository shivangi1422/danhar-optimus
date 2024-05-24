
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
  
    // Iterate over each section
    contentBlocks.forEach((blocks) => {
      // Appending Hero banner from each section
      const heroBanner = blocks.querySelector('.hero-wrapper');
      if (heroBanner) {
        defaultTemplate.appendChild(heroBanner); // Clone to avoid removing the original
      }
  
      main.appendChild(blocks);
      blocks.style.display = null;
    });
  
    // Creating clearfix element
    const clearFix = document.createElement('div');
    clearFix.className = 'clearfix';
  
    outerElement.appendChild(main);
    content.appendChild(outerElement);
    content.appendChild(clearFix);
    defaultTemplate.appendChild(content);
    block.appendChild(defaultTemplate);
  }
  