import Layout from '../../components/layout'

import { getAllPostIds, getPostData } from '../../lib/posts'

// ビルド可能なファイルデータを取得
export async function getStaticProps({ params }) {
    const postData = getPostData(params.id)
    return {
        props: {
            postData,
        },
    }
}

// ビルド可能なファイルデータを参照
export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
        // pathsは事前ビルドするパス対象を指定するパラメータ
        // pathsに入っているのは...
        // {params: {id: 'pre-renderind'}},
        // {params: {id: 'ssg-ssr'}}
        paths,
        // fallbackにfalseを指定すると、事前ビルドしたパス以外にアクセスした時404を返す
        // trueならば用意したページを表示できる
        fallback: false,
    }
}

// 取得したファイルデータからメタデータを表示
export default function Post({ postData }) {
    return (
        <Layout>
            {postData.title}
            <br />
            {postData.id}
            <br />
            {postData.date}
        </Layout>
    )
}
