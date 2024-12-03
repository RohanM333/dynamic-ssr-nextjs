// pages/server-side.js
import React from 'react';
import { useRouter } from 'next/router';

const ServerSidePage = ({ data, page }) => {
  const router = useRouter();

  const fetchMorePosts = () => {
    // Navigate to the next page
    router.push(`/server-side?page=${page + 1}`);
  };

  return (
    <div>
      <h1>Server-Side Rendering with Dynamic Data</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      <button onClick={fetchMorePosts}>Load More Posts</button>
    </div>
  );
};

export async function getServerSideProps(context) {
  // Get the current page from query parameters, default to 1
  const page = parseInt(context.query.page) || 1;
  const limit = 10; // Number of posts per page

  // Fetch dynamic data from an API with pagination
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
  const data = await res.json();

  return {
    props: {
      data,
      page,
    },
  };
}

export default ServerSidePage;
