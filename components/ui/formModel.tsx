'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from './button'
import { Notes } from '@/app/types/types'
import { Bot } from 'lucide-react'
import { toast } from 'sonner' // You can remove this and fallback to alert if not using `sonner`

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (note: { title: string, content: string, summary: string }, id?: string) => void
  noteToEdit?: Notes | null
}

const FormModal = ({ open, onClose, onSubmit, noteToEdit }: Props) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [loadingSummary, setLoadingSummary] = useState(false)

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title)
      setContent(noteToEdit.content)
      setSummary(noteToEdit.summary)
    } else {
      setTitle('')
      setContent('')
      setSummary('')
    }
  }, [noteToEdit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, content, summary }, noteToEdit?.id)
  }

  const handleSummarize = async () => {
    if (!title || !content) {
      toast.warning('Please fill in both title and content first.') // fallback: alert(...)
      return
    }

    setLoadingSummary(true)
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      const data = await res.json()
      if (data.summary) {
        setSummary(data.summary)
        toast.success('Summary generated!')
      } else {
        throw new Error('No summary returned')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to summarize with AI')
    } finally {
      setLoadingSummary(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{noteToEdit ? 'Edit Note' : 'Create Note'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <div className="relative">
            <textarea
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 border rounded-md h-28"
              required
              readOnly // 🔒 Prevent accidental editing
            />
            <Button
              type="button"
              className="absolute right-2 bottom-2 hover:bg-blue-400 bg-none p-2"
              onClick={handleSummarize}
              disabled={loadingSummary || !title || !content}
            >
              {loadingSummary ? '...' : <Bot className="w-4 h-4" />}
            </Button>
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            {noteToEdit ? 'Update Note' : 'Create Note'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FormModal
