'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import FormModal from '@/components/ui/formModel'
import { BotIcon, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseClient'

const HomePage = () => {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [latestEntries, setLatestEntries] = useState<Notes[]>([])
  const [noteToEdit, setNoteToEdit] = useState<Notes | null>(null)

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching Data:', error)
    } else {
      setLatestEntries(data)
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setLoading(false)
        fetchData()
      } else {
        router.push('/login')
      }
    }

    checkSession()
  }, [router])

  const handleDelete = async (noteId: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId)

    if (error) {
      alert('Delete failed.')
    } else {
      alert('Note deleted successfully')
      fetchData()
    }
  }

  const handleFormSubmit = async (
    { title, content, summary }: { title: string, content: string, summary: string },
    id?: string
  ) => {
    if (id) {
      const { error } = await supabase
        .from('notes')
        .update({ title, content, summary })
        .eq('id', id)
      if (error) return alert('Update failed.')
      alert('Note updated!')
    } else {
      const user = (await supabase.auth.getUser()).data.user
      const { error } = await supabase
        .from('notes')
        .insert([{ user_id: user?.id, title, content, summary }])
      if (error) return alert('Create failed.')
      alert('Note created!')
    }

    fetchData()
    setModalOpen(false)
    setNoteToEdit(null)
  }

  if (loading) return <div className="p-4">Checking admin privileges...</div>

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
        {latestEntries.map((data) => (
          <Card key={data.id} className="w-[800px] p-4">
            <div>
              <h3 className="text-xl font-semibold">Title: {data.title}</h3>
              <p>Content: {data.content}</p>
              <p className="text-sm text-muted-foreground mt-2">Summary: {data.summary}</p>
              <div className="mt-4 flex gap-4">
                <Button onClick={() => {
                  setNoteToEdit(data)
                  setModalOpen(true)
                }} className="bg-yellow-500 hover:bg-yellow-600">Edit</Button>
                <Button onClick={() => handleDelete(data.id)} className="bg-red-500 hover:bg-red-600">Delete</Button>
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
        onSubmit={handleFormSubmit}
        noteToEdit={noteToEdit}
      />
    </div>
  )
}

export default HomePage
