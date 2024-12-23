import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home = ({ posts }) => {
  const router = useRouter();

  const handleMouseEnter = (id) => {
    router.prefetch(`/post/${id}`);
  };

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} onMouseEnter={() => handleMouseEnter(post.id)}>
            <Link href={`/post/${post.id}`}>
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=8');
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}

export default Home;
