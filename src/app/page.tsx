import MisiApp from '@/components/mlb/MisiApp'
import { MlbProvider } from '@/lib/mlb/store'

export default function Home() {
  return (
    <MlbProvider>
      <MisiApp />
    </MlbProvider>
  )
}
