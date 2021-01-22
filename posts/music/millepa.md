---
title: 'millennium parade'
date: '2992-02-22'
---

## catch all routes

posts ディレクトリ構造のネストが深くなっても動的ルーティングが可能となる

-   [id].js のファイル名を[...id].js に変更

-   posts.js 内の getAllPostIds()の params に渡す id の値をディレクトリ構造の配列にする

-   [...id].js 内の getStaticProps()の getPostData()の引数に'/'を join する　 getPostData(params.id `.join('/')`)

*   URL に/posts/XXX/XXX と指定できる
