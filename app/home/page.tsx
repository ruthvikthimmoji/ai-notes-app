'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import FormModal from '@/components/ui/formModel'
import { Bot, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseClient'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Notes } from '../types/types'

const fetchNotes = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error('Error fetching notes')
  return data
}

const HomePage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [noteToEdit, setNoteToEdit] = useState<Notes | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔐 Auth check on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.email) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    }
    checkSession()
  }, [router])

  // 📥 Fetch Notes
  const { data: notes = [] } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
    enabled: !loading,
  })

  // 🔁 Insert/Update
  const mutation = useMutation({
    mutationFn: async ({
      note,
      id,
    }: {
      note: { title: string; content: string; summary: string }
      id?: string
    }) => {
      if (id) {
        const { error } = await supabase
          .from('notes')
          .update(note)
          .eq('id', id)
        if (error) throw new Error('Update failed')
      } else {
        const user = (await supabase.auth.getUser()).data.user
        const { error } = await supabase
          .from('notes')
          .insert([{ ...note, user_id: user?.id }])
        if (error) throw new Error('Create failed')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setModalOpen(false)
      setNoteToEdit(null)
    },
    onError: (err:unknown) => {
      if(err instanceof Error){
        alert(err.message)
      } else {
        alert('An unknown error occurred')
      }
    },
  })

  // 🗑️ Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) throw new Error('Delete failed')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
    onError: (err:unknown) => {
      if(err instanceof Error){
        alert(err.message)
      } else {
        alert('An unknown error occurred')
      }
    },
  })

  if (loading) return <div className="p-4">Checking session...</div>

  return (
    <div>
      <nav className="shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-200 ml-12">NOTES APP</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mr-12"
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-col items-center mt-10 gap-6">
        {notes.map((data: Notes) => (
          <Card key={data.id} className="w-[800px] p-4">
            <div>
              <h3 className="text-xl font-semibold">Title: {data.title}</h3>
              <p>Content: {data.content}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Summary: {data.summary}
              </p>
              <div className="mt-4 flex gap-4">
                <Button
                  onClick={() => {
                    setNoteToEdit(data)
                    setModalOpen(true)
                  }}
                  className="bg-yellow-500 hover:bg-green-600"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate(data.id)}
                  className="border hover:bg-red-600 hover:border-none"
                >
                  Delete
                </Button>
                <Button className="hover:bg-blue-400 bg-none">
                  <Bot />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        onClick={() => {
          setModalOpen(true)
          setNoteToEdit(null)
        }}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-8 rounded-full shadow-lg z-50"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <FormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setNoteToEdit(null)
        }}
        onSubmit={(note, id) => mutation.mutate({ note, id })}
        noteToEdit={noteToEdit}
      />
    </div>
  )
}

export default HomePage
