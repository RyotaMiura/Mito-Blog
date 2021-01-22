import { parseISO, format } from 'date-fns'

// 日付形式の変更
export default function Date({ dateString }) {
    const date = parseISO(dateString)
    return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
}
