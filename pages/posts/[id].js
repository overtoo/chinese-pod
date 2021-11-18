import Layout from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";

import { getAllPostIds, getPostData } from "../../lib/posts";

import React, { useState } from "react";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  const handleKeyPress = (event) => {
    if (event.key === "e") {
      alert("enter press here! ");
    }
  };
  const [showEn, setShowEn] = useState(false);
  return (
    <Layout>
      <div tabIndex="-1" onKeyDown={handleKeyPress}>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <button onClick={() => setShowEn(!showEn)}>
            {showEn ? "Hide Translation" : "Show Translation"}
          </button>
          <div
            className={utilStyles.normal}
            dangerouslySetInnerHTML={{
              __html: postData.contentHtml
                .replace(/【/g, `<span style="color:red">`)
                .replace(/】/g, `</span>`)
                .replace(
                  /{/g,
                  showEn
                    ? `<span class="myDIV">→</span> <span class="show-en">`
                    : `<span class="myDIV">→</span> <span class="hide-en">`
                )
                .replace(/}/g, `</span>`),
            }}
          />
        </article>
      </div>
    </Layout>
  );
}
