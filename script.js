let allPosts = [];

//------------ Fetch and Display Posts--------------

const fetchPost = document.getElementById("fetchButton");

fetchPost.addEventListener("click", fetchPosts);


async function fetchPosts() {

    const postList = document.getElementById("postList");
    const error = document.getElementById("error");

    // Show loading message
    postList.textContent = "Loading...";

    // Clear error
    error.textContent = "";

    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        allPosts = await response.json();
        displayPosts(allPosts);
       
    } catch (errorMessage) {
        postList.textContent = "";
        error.textContent = "Unable to load posts.";
        console.error("Error fetching data:", errorMessage);
    }
}

// ------------ Display Posts Function ------------

function displayPosts(posts) {

    const postList = document.getElementById("postList");
    let html = "";

    posts.forEach(function(post) {
        html += `
            <div id="post-${post.id}">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <button onclick="deletePost(${post.id})">
                    Delete
                </button>
            </div>
            <hr>
        `;
    });
    postList.innerHTML = html;
}

//----------- Create and Send a New Post-----------

const postForm = document.getElementById("postForm");

postForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newPost = {
        title: document.getElementById("titleInput").value,
        body: document.getElementById("bodyInput").value
      };

    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPost)
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log("Created post:", data);

        document.getElementById("formSuccess").innerHTML = `
            <h3>Post Created Successfully!</h3>
         
            <p><strong>Title:</strong> ${data.title}</p>
            <p><strong>Body:</strong> ${data.body}</p>
        `;

        document.getElementById("postForm").reset();
    })
    .catch(function(error) {
        console.error("Error:", error);

        document.getElementById("formError").textContent =
            "Unable to create post.";
    });
});

//---------Extension: Delete function ------------
async function deletePost(id) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        // Remove the post from the page
        document.getElementById(`post-${id}`).remove();

        console.log("Deleted post:", id);

    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

//------filter posts by keyword using an input field---------

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const filteredPosts = allPosts.filter(function(post) {
        return (
            post.title.toLowerCase().includes(keyword) ||
            post.body.toLowerCase().includes(keyword)
        );
    });

   // console.log("Total posts:", allPosts.length);
   // console.log("Filtered posts:", filteredPosts.length);

   // console.log(filteredPosts);

    displayPosts(filteredPosts);
});

