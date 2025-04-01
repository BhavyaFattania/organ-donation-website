// app/api/save-donation/route.ts
import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

// Define the shape of your form data
interface FormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    bloodType: string
    organType: string
    agreeToTerms: boolean
}

export async function POST(request: Request) {
    try {
        const formData: FormData = await request.json()
        const key = "donations"

        // Get existing data, typed as an array of FormData or null
        let existingData = (await kv.get<FormData[]>(key)) || []
        if (!Array.isArray(existingData)) existingData = []

        // Append new data
        existingData.push(formData)

        // Save back to KV
        await kv.set(key, existingData)
        console.log("Data saved to KV:", existingData)

        return NextResponse.json({ message: "Data saved successfully" }, { status: 200 })
    } catch (error) {
        console.error("Error saving to KV:", error)
        return NextResponse.json(
            { message: "Failed to save data", error: String(error) },
            { status: 500 }
        )
    }
}