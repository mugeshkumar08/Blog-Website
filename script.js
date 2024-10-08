document.addEventListener('DOMContentLoaded', function () {
    let editorInstance;

    ClassicEditor
        .create(document.querySelector('#description'))
        .then(editor => {
            editorInstance = editor;
        })
        .catch(error => {
            console.error(error);
        });

    document.getElementById('blogForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const title = document.getElementById('title').value;
        const image = document.getElementById('image').files[0];
        const category = document.getElementById('category').value;
        const shortDescription = document.getElementById('shortDescription').value;
        const description = editorInstance.getData();

        if (title && image && category && shortDescription && description.trim()) {
            let blogs = JSON.parse(localStorage.getItem('blogs')) || [];

            const newBlog = {
                title: title,
                category: category,
                shortDescription: shortDescription,
                description: description,
            };

            // For the image, convert it to a Data URL
            const reader = new FileReader();
            reader.onload = function () {
                newBlog.image = reader.result;
                
                blogs.push(newBlog);
                localStorage.setItem('blogs', JSON.stringify(blogs));

                window.location.href = 'blogDetails.html';
            };
            reader.readAsDataURL(image);

        } else {
            alert('Please fill out all the fields before submitting.');
        }
    });
});

     // Retrieve all blogs from localStorage (blog.html)
const blogs = JSON.parse(localStorage.getItem('blogs')) || [];

const blogsContainer = document.getElementById('blogsContainer');
const searchInput = document.getElementById('search');

// Function to display blogs
function displayBlogs(filteredBlogs) {
    blogsContainer.innerHTML = '';

    if (filteredBlogs.length === 0) {
        blogsContainer.innerHTML = '<p>No blogs found</p>';
        return;
    }

    filteredBlogs.forEach((blog, index) => {
        const blogDiv = document.createElement('div');
        blogDiv.classList.add('blog-container');

        const blogTitle = document.createElement('h3');
        blogTitle.textContent = blog.title;
        blogDiv.appendChild(blogTitle);

        const blogImage = document.createElement('img');
        blogImage.src = blog.image;
        blogImage.alt = "Blog Image";
        blogDiv.appendChild(blogImage);

        const blogCategory = document.createElement('p');
        blogCategory.innerHTML = `<strong>Category: </strong>${blog.category}`;
        blogDiv.appendChild(blogCategory);

        const blogShortDescription = document.createElement('p');
        blogShortDescription.innerHTML = `<strong>Short Description: </strong>${blog.shortDescription}`;
        blogDiv.appendChild(blogShortDescription);

        const blogDescription = document.createElement('p');
        blogDescription.innerHTML = `<strong>Description: </strong>${blog.description}`;
        blogDiv.appendChild(blogDescription);
        blogDescription.style.display = 'none';

        // Create and append "Read More" link
        const readMoreLink = document.createElement('a');
        readMoreLink.href = `blogDetails.html?index=${index}`;
        readMoreLink.textContent = "Read More";
        readMoreLink.style.display = "block";
        readMoreLink.style.marginTop = "10px";
        blogDiv.appendChild(readMoreLink);

        blogsContainer.appendChild(blogDiv);
    });
}
    displayBlogs(blogs);

// Function to filter blogs based on the search query
function searchBlogs(query) {
    const filteredBlogs = blogs.filter(blog => {
        const titleMatch = blog.title.toLowerCase().includes(query.toLowerCase());
        const categoryMatch = blog.category.toLowerCase().includes(query.toLowerCase());
        const descriptionMatch = blog.description.toLowerCase().includes(query.toLowerCase());

        return titleMatch || categoryMatch || descriptionMatch;
    });

    displayBlogs(filteredBlogs);
}

// Add event listener for the search input
searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim();
    searchBlogs(query);
});

      // Function to filter blogs based on the selected category
      function filterBlogs() {
          const selectedCategory = document.getElementById('category').value;
          
          const filteredBlogs = selectedCategory === 'all' 
              ? blogs 
              : blogs.filter(blog => blog.category === selectedCategory);

          displayBlogs(filteredBlogs);
      }
