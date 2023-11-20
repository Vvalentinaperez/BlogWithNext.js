import fs from "fs";
import matter from "gray-matter";
import path from "path";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import mdxPrism from "mdx-prism";

const root = process.cwd();

//Esta me trae todas las carpetas
export async function getFiles(type) {
  //El type es un string
  return fs.readdirSync(path.join(root, "data", type));
}

//Obtiene un archivo por el slug
//Slug (si el archivo esta fuera de una carpeta)
//Type (si el archivo esta dentro de una carpeta)
export async function getFileBySlug(type, slug) {
  const source = slug //de donde viene el archivo
    ? fs.readFileSync(path.join(root, "data", type, `${slug}.mdx`), "utf8")
    : fs.readFileSync(path.join(root, "data", `${type}.mdx`), "utf8");

  const { data, content } = matter(source);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        require("remark-slug"),
        [
          require("remark-autolink-headings"),
          {
            linkProperties: {
              className: ["anchor"],
            },
          },
        ],
        require("remark-code-titles"),
      ],
      rehypePlugins: [mdxPrism],
    },
  });
  return {
    mdxSource,
    frontMatter: {
      wordCount: content.split(/\s+/gu).length,
      readingTime: readingTime(content),
      slug: slug || null,
      ...data,
    },
  };
}

//Esta es para obtener todos los archivos que esten dentro de un carpeta
export async function getFilesFrontMatter(type) {
  const files = fs.readdirSync(path.join(root, "data", type));

  return files.reduce((allPosts, postSlug) => {
    const source = fs.readFileSync(
      path.join(root, "data", type, postSlug),
      "utf8"
    );
    const { data } = matter(source);

    return [
      {
        ...data,
        slug: postSlug.replace(".mdx", ""),
      },
      ...allPosts,
    ];
  }, []);
}
