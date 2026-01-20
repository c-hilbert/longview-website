import Link from 'next/link'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Discussions</h1>
          <Link
            href="/discussions/new"
            className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-md hover:bg-neutral-800"
          >
            New Discussion
          </Link>
        </div>

        <Card>
          <p className="text-neutral-600 text-center py-8">
            No discussions yet. Be the first to start a conversation.
          </p>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card>
          <h2 className="font-semibold mb-4">About Longview</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            A community hub for discussing long-form journalism, investigative reporting,
            and podcast episodes from the Longview network.
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Latest Episodes</h2>
          <p className="text-sm text-neutral-600">
            No episodes yet.
          </p>
        </Card>

        <Card>
          <h2 className="font-semibold mb-3">Community Guidelines</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Be respectful, stay on topic, and cite your sources.
          </p>
          <Link
            href="/guidelines"
            className="text-sm font-medium hover:underline"
          >
            Read full guidelines →
          </Link>
        </Card>
      </aside>
    </div>
  )
}
