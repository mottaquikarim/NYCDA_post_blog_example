(function() { // protect the lemmings!

    const urlBase = 'https://staticblog-nycda.webscript.io/';

    // ------------------ FEED PAGE VIEW --------------- //
    Routes.register('/feed', () => {
        const endpoint = urlBase + 'api/posts';
        const {appendTo, renderEmptySet, classMethods} = Views;

        const view = document.querySelectorAll('.view');
        classMethods(view, 'view-hide', 'add');
        const feed = document.querySelector('.js-feed');
        classMethods(feed, 'view-hide', 'remove');

        const container = document.querySelector('.js-todolist');

        ajax.GET(endpoint).then((data) => {
            container.innerHTML = "";
            if (data.posts.length === 0) {
                appendTo(container, renderEmptySet(), true);
                return;
            }

            for( const post of data.posts) {
                const html = `
<h1>
    <a href="#/post/${post.id}">
        ${post.data.title}
    </a>
</h1>
<em>${post.data.author}</em>
<p>${post.data.content}</p>
<hr/>
                `;
                appendTo(container, html, true);
            }

        });

    }); // feed
    // ------------------ END FEED PAGE VIEW --------------- //


    // ------------------ ADMIN PAGE VIEW --------------- //
    Routes.register('/admin', () => {
        const endpoint = urlBase + 'api/posts';
        const {appendTo, renderEmptySet, classMethods} = Views;

        const view = document.querySelectorAll('.view');
        classMethods(view, 'view-hide', 'add');
        const admin = document.querySelector('.js-admin');
        classMethods(admin, 'view-hide', 'remove');

        const addBtn = document.querySelector('.js-add-todo');
        const titleEl = document.querySelector('.js-post-title');
        const authorEl = document.querySelector('.js-post-author');
        const bodyEl = document.querySelector('.js-post-body');

        addBtn.addEventListener('click', (e) => {
            e.preventDefault();

            titleEl.setAttribute('disabled', 'disabled');
            authorEl.setAttribute('disabled', 'disabled');
            bodyEl.setAttribute('disabled', 'disabled');

            const title = titleEl.value;
            const author = authorEl.value;
            const body = bodyEl.value;

            if (!title || !author || !body) {
                alert('required fields!');
                console.log(title, author, body);
                return;
            }

            ajax.POST(endpoint, {
                "title": title,
                "author": author,
                "content": body 
            }).then((data) => {
                titleEl.removeAttribute('disabled');
                authorEl.removeAttribute('disabled');
                bodyEl.removeAttribute('disabled');

                titleEl.value = '';
                authorEl.value = "";
                bodyEl.innerHTML = "";

                alert('created! press ok to navigate to post...');
                window.location.href = '#/post/' + data.posts.pop().id;
            });

        });

    }); // feed
    // ------------------ END ADMIN PAGE VIEW --------------- //

    // ------------------ POST PAGE VIEW --------------- //
    Routes.register('/post/:id', (id) => {
        const endpoint = urlBase + 'api/posts?postId=' + id;
        const {appendTo, renderEmptySet, classMethods} = Views;

        const view = document.querySelectorAll('.view');
        classMethods(view, 'view-hide', 'add');
        const post = document.querySelector('.js-post');
        classMethods(post, 'view-hide', 'remove');

        ajax.GET(endpoint).then((data) => {
            const html = `
<h1>${data.data.title}</h1>
<em>${data.data.author}</em>
<p>${data.data.content}</p>
            `;

            appendTo(post, html, true);
        });

    }); // feed
    // ------------------ POST FEED PAGE VIEW --------------- //

    Routes.init( '/feed' );

})();
