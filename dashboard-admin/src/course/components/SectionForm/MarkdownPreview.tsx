import { useEffect, useState } from "react"
import Markdown from "markdown-to-jsx"

export default function MarkdownPreview({ markdown }: { markdown: string }) {

  return (
    <div>
      <div className="prose " style={{maxWidth: "100%",  maxHeight: "100%", overflow: "auto"}}>
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  )
}

