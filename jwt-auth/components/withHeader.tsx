import Head from "next/head";
import React from "react";

interface HeaderProps {
  title: string;
  meta: { name: string; content: string }[];
  links: { rel: string; href: string }[];
  [key: string]: any;
}

export default function withHeader(WrappedComponent: React.FC) {
  return ({ title, meta, links, ...props }: HeaderProps) => {
    return (
      <>
        <Head>
          <title>{title}</title>
          {meta.map((m, i) => (
            <meta key={i} name={m.name} content={m.content} />
          ))}
          {links.map((l, i) => (
            <link key={i} rel={l.rel} href={l.href} />
          ))}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <WrappedComponent {...props} />
      </>
    );
  };
}
