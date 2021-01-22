import Layout from '../../components/layout'
import Head from 'next/head'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'

// ビルド可能なファイルデータを取得
export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id)
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
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}
