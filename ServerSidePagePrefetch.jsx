import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const ServerSidePage = ({ initialData, initialPage }) => {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const fetchMorePosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts?page=${page + 1}&limit=10`);
      setData([...data, ...res.data]);
      setPage(page + 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Prefetch data for the next page on hover
    const link = document.querySelector('a[href="/server-side?page=' + (page + 1) + '"]');
    if (link) {
      link.addEventListener('mouseenter', fetchMorePosts);
    }
    return () => {
      if (link) {
        link.removeEventListener('mouseenter', fetchMorePosts);
      }
    };
  }, [page]);

  return (
    <div>
      <h1>Server-Side Rendering with Dynamic Data</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      <button onClick={fetchMorePosts} disabled={loading}>
        {loading ? 'Loading...' : 'Load More Posts'}
      </button>
    </div>
  );
};

export async function getServerSideProps(context) {
  const page = parseInt(context.query.page) || 1;
  const limit = 10;

  try {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
    const data = res.data;
    return {
      props: {
        initialData: data,
        initialPage: page,
      },
    };
  } catch (error) {
    return {
      props: {
        initialData: [],
        initialPage: 1,
        error: 'Failed to fetch data'
      },
    };
  }
}

export default ServerSidePage;
