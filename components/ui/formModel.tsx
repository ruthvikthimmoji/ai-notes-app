'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from './button'
import { Notes } from '@/types/types' // Optional: Your custom type

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{noteToEdit ? 'Edit Note' : 'Create Note'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <input type="text" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <textarea placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full px-3 py-2 border rounded-md h-28" required />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            {noteToEdit ? 'Update Note' : 'Create Note'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FormModal
