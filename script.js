document.addEventListener('DOMContentLoaded', function () {
    let editorInstance;

    // Initialize CKEditor 5 for the blog description
    ClassicEditor
        .create(document.querySelector('#description'))
        .then(editor => {
            editorInstance = editor;
        })
        .catch(error => {
            console.error(error);
        });

    // Handle form submission
    document.getElementById('blogForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form data
        const title = document.getElementById('title').value;
        const image = document.getElementById('image').files[0];
        const category = document.getElementById('category').value;
        const shortDescription = document.getElementById('shortDescription').value;
        const description = editorInstance.getData(); // Get CKEditor content

        // Validate the form fields
        if (title && image && category && shortDescription && description.trim()) {
            let blogs = JSON.parse(localStorage.getItem('blogs')) || [];

            // Prepare the blog data to store
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
                
                // Append the new blog to the blogs array
                blogs.push(newBlog);

                // Store the updated blogs array back to localStorage
                localStorage.setItem('blogs', JSON.stringify(blogs));

                // Redirect to the "" page
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

      // Get the blogs container
      const blogsContainer = document.getElementById('blogsContainer');

      // Function to display blogs
      function displayBlogs(filteredBlogs) {
          // Clear the container
          blogsContainer.innerHTML = '';

          // Iterate through each blog and display it
          filteredBlogs.forEach((blog, index) => {
              const blogDiv = document.createElement('div');
              blogDiv.classList.add('blog-container');  // Assign blog-container class to each blog post
              
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

      // Function to filter blogs based on the selected category
      function filterBlogs() {
          const selectedCategory = document.getElementById('category').value;
          
          const filteredBlogs = selectedCategory === 'all' 
              ? blogs 
              : blogs.filter(blog => blog.category === selectedCategory);

          displayBlogs(filteredBlogs);
      }

