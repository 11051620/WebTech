function htmlUnescape(escapedHTML) {
    var div = document.createElement('div');
    div.innerHTML = escapedHTML;
    return div.textContent;
}


function insertArticleText(article) {
    // Get all the grid items with the 'data-text' attribute
    const textGridItems = Array.from(document.querySelectorAll('.grid-item[data-text]'));

    // Track the current grid item index
    let itemIndex = 0;

    // Initialize a new paragraph element
    let tempElement = document.createElement('p');
    textGridItems[itemIndex].appendChild(tempElement);

    // Loop over each paragraph
    for (let paragraph of article) {
        // Convert paragraph into HTML nodes
        let div = document.createElement('div');
        div.innerHTML = paragraph;

        for (let node of div.childNodes) {
            // Append the new word to the temporary element
            tempElement.appendChild(node.cloneNode(true));
            tempElement.appendChild(document.createTextNode(' ')); // Add space

            // Check if the grid item is overflowing
            if (textGridItems[itemIndex].scrollHeight > textGridItems[itemIndex].clientHeight) {
                // If the grid item is overflowing, remove the last appended child
                tempElement.removeChild(tempElement.lastChild); // remove added space
                tempElement.removeChild(tempElement.lastChild); // remove added node

                // Move to the next grid item
                itemIndex++;
                if (itemIndex >= textGridItems.length) return; // Stop if there are no more grid items

                // Create new paragraph for the new grid item
                tempElement = document.createElement('p');
                tempElement.appendChild(node.cloneNode(true));
                tempElement.appendChild(document.createTextNode(' ')); // Add space
                textGridItems[itemIndex].appendChild(tempElement);
            }
        }

        // Add a line break after each paragraph
        tempElement.appendChild(document.createElement('br'));
    }
}

function highlightMetadata() {
  const types = [
      { selector: '.highlight-person', checkboxId: 'personsCheckbox', typeName: 'Person' },
      { selector: '.highlight-historicalperson', checkboxId: 'historicalPersonsCheckbox', typeName: 'Historical Person' },
      { selector: '.highlight-location', checkboxId: 'locationsCheckbox', typeName: 'Location' },
      { selector: '.highlight-politics', checkboxId: 'politicsCheckbox', typeName: 'Politics' }
  ];

  const tableBody = document.querySelector('#metadataTable tbody');
  tableBody.innerHTML = '';  // Clear existing rows

  // Create a map to store unique values and their counts
  const valuesCount = new Map();

  types.forEach(type => {
      const elements = document.querySelectorAll(type.selector);
      if (document.getElementById(type.checkboxId).checked) {
          elements.forEach(el => {
              el.classList.add('active');

              const value = el.textContent;
              
              valuesCount.set(value, (valuesCount.get(value) || 0) + 1);
          });
      } else {
          elements.forEach(el => el.classList.remove('active'));
      }
  });

  // Convert the map to an array, then sort the array based on the counts
  const sortedEntries = Array.from(valuesCount.entries()).sort((a, b) => b[1] - a[1]);

  // Add sorted unique values to the table along with their counts
  for (let [value, count] of sortedEntries) {
      const row = document.createElement('tr');
      const typeCell = document.createElement('td');
      typeCell.textContent = "";  // This should be updated if you want to map the value to its type
      const valueCell = document.createElement('td');
      valueCell.textContent = value;
      const countCell = document.createElement('td');
      countCell.textContent = count;
      row.appendChild(typeCell);
      row.appendChild(valueCell);
      row.appendChild(countCell);
      tableBody.appendChild(row);
  }
}
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('personCheckbox').addEventListener('change', function() {
    // If the checkbox is not checked
    if (!this.checked) {
      // Set the style of the 'highlight-person' class to be hidden
      const highlightPersonElements = document.getElementsByClassName('highlight-person');
      for (let i = 0; i < highlightPersonElements.length; i++) {
        highlightPersonElements[i].style.backgroundColor = 'transparent';
      }
    } else {
      // If the checkbox is checked, restore the background color
      const highlightPersonElements = document.getElementsByClassName('highlight-person');
      for (let i = 0; i < highlightPersonElements.length; i++) {
        highlightPersonElements[i].style.backgroundColor = 'yellow';
      }
    }
  });
});

  
