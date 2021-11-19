import Layout from "../../components/layout";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";

import { getAllPostIds, getPostData } from "../../lib/posts";

import React, { useState, useEffect } from "react";

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

export async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export default function Post({ postData }) {
  const [pageURL, setPageURL] = useState("");
  const [isNativeShare, setNativeShare] = useState(false);
  useEffect(() => {
    setPageURL(window.location.href);
    if (navigator.share) {
      setNativeShare(true);
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "e") {
      alert("enter press here! ");
    }
  };
  const [showEn, setShowEn] = useState(false);

  function highlightVocab(words = "好好好好", text) {
    const arr = words.split(" ");
    arr.map((item) => (text = text.split(item).join(`【${item}】`)));
    return text;
  }

  function plecofy(a, b) {
    {
      return (
        highlightVocab(a, b)
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replace(/{.*}/g, "") +
        highlightVocab(a, b).replace(/<\/?[^>]+(>|$)/g, "")
      );
    }
  }

  function twoInOne() {
    copyTextToClipboard(plecofy(postData.words, postData.contentHtml));
    window.open("plecoapi://x-callback-url/clipboard", "_blank");
  }
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
          <button onClick={() => twoInOne()}>Transcript Pleco</button>
          <button
            onClick={() =>
              window.open(
                "plecoapi://x-callback-url/s?q=" + postData.words,
                "_blank"
              )
            }
          >
            Vocab Pleco
          </button>
          <div
            className={utilStyles.normal}
            dangerouslySetInnerHTML={{
              __html: highlightVocab(postData.words, postData.contentHtml)
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
