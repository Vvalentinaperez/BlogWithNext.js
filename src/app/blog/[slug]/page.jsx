import { MDXRemote } from "next-mdx-remote";
import MDXComponents from "@/componentes/MDXComponentes";
import { getFiles, getFileBySlug } from "@/lib/mdx";

const DynamicPost = (props) => {
  return (
    <div className="container px-5">
      Hola
      <MDXRemote {...props} components={MDXComponents} />
    </div>
  );
};

export const getStaticPaths = async () => {
  const posts = await getFiles("posts");
  const paths = posts.map((post) => ({
    params: {
      slug: post.replace(/\.mdx/, ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  console.log(params);
  const post = await getFileBySlug("posts", String(params?.slug));
  return {
    props: {
      ...post,
    },
  };
};

export default DynamicPost;
