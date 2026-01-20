import { Card } from '@/components/ui/Card'

export default function GuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Community Guidelines</h1>

      <Card className="prose prose-neutral max-w-none">
        <h2>Welcome to Longview</h2>
        <p>
          This community is a place for thoughtful discussion about long-form journalism,
          investigative reporting, and the topics covered in our podcast series.
        </p>

        <h2>Discussion Guidelines</h2>

        <h3>Be Respectful</h3>
        <p>
          Treat other community members with respect, even when you disagree. Personal attacks,
          harassment, and inflammatory language are not tolerated.
        </p>

        <h3>Stay On Topic</h3>
        <p>
          Keep discussions relevant to the post or episode being discussed. Tangential discussions
          are welcome but should be clearly noted.
        </p>

        <h3>Cite Your Sources</h3>
        <p>
          When making factual claims, please provide sources when possible. This helps maintain
          the quality of discussion and allows others to verify information.
        </p>

        <h3>No Self-Promotion</h3>
        <p>
          This community is not a place for advertising or self-promotion. Posts that exist
          primarily to promote external content or products will be removed.
        </p>

        <h2>Voting</h2>
        <p>
          Upvotes should be used to elevate thoughtful, well-reasoned contributions that add
          to the discussion—not simply to agree with a position. Consider upvoting comments
          that present new information, ask good questions, or offer constructive perspectives.
        </p>

        <h2>Moderation</h2>
        <p>
          Our team moderates discussions to maintain a productive environment. Posts or comments
          that violate these guidelines may be removed. Repeat violations may result in account
          suspension.
        </p>

        <h2>Questions?</h2>
        <p>
          If you have questions about these guidelines or need to report a concern, please
          contact us at community@longviewinvestigations.com.
        </p>
      </Card>
    </div>
  )
}
