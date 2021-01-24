import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import fetch from 'node-fetch'

const base64 = require('js-base64').Base64

const postsDirectory = path.join(process.cwd(), 'posts')

// postsディレクトリから事前にビルド可能なファイルのファイル名をidとして取得。paramsにオブジェクトとして格納
export async function getAllPostIds() {
    // const fileNames = fs.readdirSync(postsDirectory)

    // GitHubレポジトリ内ディレクトリを指定し
    const repoUrl = 'https://api.github.com/repos/ryotamiura/mito-blog/contents/posts'
    // GitHub APIを叩いて
    const response = await fetch(repoUrl)
    // json形式としてファイルデータを取得
    const files = await response.json()
    // ファイルデータからファイル名を取り出す
    const fileNames = files.map((file) => file.name)

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        }
    })
}

//getAllPostIdsで取得したid(ファイル名)と紐づいたファイルデータの中身を取得
export async function getPostData(id) {
    // const fullPath = path.join(postsDirectory, `${id}.md`)
    // const fileContents = fs.readFileSync(fullPath, 'utf8')

    //postsディレクトリ内のファイルデータを指定し
    const repoUrl = `https://api.github.com/repos/ryotamiura/mito-blog/contents/posts/${id}.md`
    // APIを叩いてデータを取得
    const response = await fetch(repoUrl)
    // json形式で取得
    const file = await response.json()
    // ファイルデータの中身はエンコードされた状態なのでbase64でデコードしてあげる
    const fileContents = base64.decode(file.content)

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(matterResult.content)
    const contentHtml = processedContent.toString()

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        ...matterResult.data,
    }
}

// postsディレクトリ内のファイル名からidを生成、ソートしてファイルデータを取得
export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            ...matterResult.data,
        }
    })
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}
