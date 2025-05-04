const mainSection = document.getElementById('main-section');
const bookmarkListSection = document.getElementById('bookmark-list-section');
const formSection = document.getElementById('form-section');
const categoryList = document.getElementById('category-list');
const categoryNames = document.getElementsByClassName('category-name'); 
const categoryDropdown = document.getElementById('category-dropdown');
const viewCategoryButton = document.getElementById('view-category-button');
const addBookmarkButton = document.getElementById('add-bookmark-button');
const nameInput = document.getElementById('name');
const urlInput = document.getElementById('url');
const closeFormButton = document.getElementById('close-form-button');
const addBookmarkButtonForm = document.getElementById('add-bookmark-button-form');
const closeListButton = document.getElementById('close-list-button');
const deleteBookmarkButton = document.getElementById('delete-bookmark-button');

// Function to get bookmarks from local storage
const getBookmarks = () => {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) {
    try {
      const bookmarksArray = JSON.parse(bookmarks);
      // Check if the parsed data is an array
      if (Array.isArray(bookmarksArray)) {
        return bookmarksArray;
      }
    } catch (e) {
      console.error("Error parsing bookmarks from localStorage:", e);
    }
  }
  return []; // Return an empty array if no bookmarks or invalid data
};

// Function to save bookmarks to local storage
const saveBookmarks = (bookmarks) => {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

// Function to toggle visibility of main and form sections
const displayOrCloseForm = () => {
  mainSection.classList.toggle('hidden');
  formSection.classList.toggle('hidden');
};

// Function to toggle visibility of main and bookmark list sections
const displayOrHideCategory = () => {
  mainSection.classList.toggle('hidden');
  bookmarkListSection.classList.toggle('hidden');
};

// Function to update category names in the headers
const updateCategoryHeaders = (category) => {
  for (let i = 0; i < categoryNames.length; i++) {
    categoryNames[i].innerText = `${category.charAt(0).toUpperCase() + category.slice(1)} Bookmarks`;
  }
};

// Event listener for adding a new bookmark (from main section)
addBookmarkButton.addEventListener('click', () => {
  const selectedCategory = categoryDropdown.value;
  updateCategoryHeaders(selectedCategory);
  displayOrCloseForm();
});

// Event listener for closing the form
closeFormButton.addEventListener('click', () => {
  displayOrCloseForm();
  // Clear form inputs when closing
  nameInput.value = '';
  urlInput.value = '';
});

// Event listener for adding a bookmark from the form
addBookmarkButtonForm.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const url = urlInput.value.trim();
  const category = categoryDropdown.value; // Get category from dropdown

  if (!name || !url) {
    alert('Please provide both name and URL for the bookmark.');
    return;
  }

  const bookmarks = getBookmarks();

  // Add the new bookmark object
  bookmarks.push({
    name: name,
    category: category,
    url: url
  });

  saveBookmarks(bookmarks);

  // Reset form inputs
  nameInput.value = '';
  urlInput.value = '';

  displayOrCloseForm(); // Hide form and show main section
});

// Function to display bookmarks for the selected category
const displayBookmarksByCategory = () => {
  const selectedCategory = categoryDropdown.value;
  const bookmarks = getBookmarks();
  const filteredBookmarks = bookmarks.filter(bookmark => bookmark.category === selectedCategory);

  categoryList.innerHTML = ''; // Clear the current list

  if (filteredBookmarks.length === 0) {
    categoryList.innerHTML = '<p>No Bookmarks Found</p>';
  } else {
    filteredBookmarks.forEach(bookmark => {
      const bookmarkItem = document.createElement('div');
      bookmarkItem.innerHTML = `
        <input type="radio" id="${bookmark.name}-${bookmark.category}" name="selected-bookmark" value="${bookmark.name}">
        <label for="${bookmark.name}-${bookmark.category}"><a href="${bookmark.url}" target="_blank">${bookmark.name}</a></label>
      `;
      categoryList.appendChild(bookmarkItem);
    });
  }
};


// Event listener for viewing bookmarks by category
viewCategoryButton.addEventListener('click', () => {
  const selectedCategory = categoryDropdown.value;
  updateCategoryHeaders(selectedCategory);
  displayBookmarksByCategory(); // Display bookmarks before showing the list
  displayOrHideCategory();
});

// Event listener for closing the bookmark list
closeListButton.addEventListener('click', () => {
  displayOrHideCategory();
});

// Event listener for deleting a bookmark
deleteBookmarkButton.addEventListener('click', () => {
  const selectedBookmarkRadio = document.querySelector('input[name="selected-bookmark"]:checked');

  if (selectedBookmarkRadio) {
    const bookmarkNameToDelete = selectedBookmarkRadio.value;
    const selectedCategory = categoryDropdown.value; // Get current category

    let bookmarks = getBookmarks();

    // Find the index of the bookmark to delete based on name AND category
    const bookmarkIndexToDelete = bookmarks.findIndex(bookmark =>
      bookmark.name === bookmarkNameToDelete && bookmark.category === selectedCategory
    );

    if (bookmarkIndexToDelete !== -1) {
      bookmarks.splice(bookmarkIndexToDelete, 1); // Remove the bookmark
      saveBookmarks(bookmarks); // Save the updated list
      displayBookmarksByCategory(); // Update the displayed list
    } else {
      alert('Selected bookmark not found in the current category.');
    }

  } else {
    alert('Please select a bookmark to delete.');
  }
});

