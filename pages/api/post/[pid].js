// RESTfulなAPIを用意したい時などに便利
// 動的ルーティング
export default function handler(req, res) {
    const {
        query: { pid },
    } = req

    res.end(`Post: ${pid}`)
}
