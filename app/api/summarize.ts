// app/api/summarize/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { title, content } = await req.json()

    // Validate inputs
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 })
    }

    // Prepare prompt for OpenAI
    const prompt = `Summarize this note for me:\n\nTitle: ${title}\nContent: ${content}`

    console.log('Sending request to OpenAI API with prompt:', prompt)  // Log the prompt

    // Send request to OpenAI API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    })

    // Log response status for debugging
    console.log('OpenAI response status:', openaiRes.status)

    // Check if OpenAI responded successfully
    if (!openaiRes.ok) {
      const errorText = await openaiRes.text()
      console.error('OpenAI API Error:', errorText)
      return NextResponse.json({ error: 'Failed to generate summary from OpenAI.' }, { status: 500 })
    }

    // Parse response from OpenAI
    const json = await openaiRes.json()
    console.log('OpenAI response JSON:', json)  // Log the API response for debugging

    const summary = json.choices?.[0]?.message?.content?.trim() || 'Failed to generate summary.'

    return NextResponse.json({ summary })

  } catch (err) {
    // Catch any other errors
    console.error('Summary API error:', err)
    return NextResponse.json({ error: 'Something went wrong while summarizing.' }, { status: 500 })
  }
}
