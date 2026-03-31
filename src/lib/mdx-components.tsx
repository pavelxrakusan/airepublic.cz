import dynamic from 'next/dynamic'

const SnakeTerminal = dynamic(() => import('@/components/SnakeTerminal'), { ssr: false })
const SnakeLeaderboard = dynamic(() => import('@/components/SnakeLeaderboard'), { ssr: false })

export const mdxComponents = {
  SnakeTerminal,
  SnakeLeaderboard,
}
