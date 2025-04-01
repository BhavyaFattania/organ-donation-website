// [your-form-file].tsx (e.g., app/donation-form.tsx)
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  bloodType?: string
  organType?: string
  agreeToTerms?: string
}

export function DonationForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bloodType: "",
    organType: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateStep1 = () => {
    const newErrors: FormErrors = {}
    if (!formData.firstName || !/^[a-zA-Z]{2,}$/.test(formData.firstName)) {
      newErrors.firstName = "First name must be at least 2 letters (A-Z only)."
    }
    if (!formData.lastName || !/^[a-zA-Z]{2,}$/.test(formData.lastName)) {
      newErrors.lastName = "Last name must be at least 2 letters (A-Z only)."
    }
    if (!formData.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Email must include '@' and a valid domain (e.g., example.com)."
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits (numbers only)."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: FormErrors = {}
    if (!formData.bloodType) {
      newErrors.bloodType = "Please select a blood type."
    }
    if (!formData.organType) {
      newErrors.organType = "Please select a donation type."
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
    setErrors((prev) => ({ ...prev, agreeToTerms: "" }))
  }

  const nextStep = () => {
    if (validateStep1()) {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep2()) {
      try {
        const response = await fetch("/api/save-donation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
        const responseText = await response.text() // Debug: Get raw response
        console.log("Raw server response:", responseText)

        if (response.ok) {
          alert("Thank you for registering as a donor! Data saved to JSON file.")
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            bloodType: "",
            organType: "",
            agreeToTerms: false,
          })
          setStep(1)
        } else {
          let errorData
          try {
            errorData = JSON.parse(responseText)
          } catch (jsonError) {
            console.error("Response is not JSON:", jsonError, "Raw:", responseText)
            throw new Error("Server returned invalid response")
          }
          console.error("Server error:", errorData)
          throw new Error(`Failed to save data: ${errorData.message}`)
        }
      } catch (error) {
        console.error("Error saving data:", error)
        alert("There was an error saving your data. Please try again.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {/* Your existing form JSX remains unchanged */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <Button type="button" onClick={nextStep} className="w-full">
            Next
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bloodType">Blood Type</Label>
            <Select
              onValueChange={(value) => handleSelectChange("bloodType", value)}
              defaultValue={formData.bloodType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="unknown">I don’t know</SelectItem>
              </SelectContent>
            </Select>
            {errors.bloodType && <p className="text-red-500 text-sm">{errors.bloodType}</p>}
          </div>

          <div className="space-y-2">
            <Label>What would you like to donate?</Label>
            <RadioGroup
              defaultValue={formData.organType}
              onValueChange={(value) => handleSelectChange("organType", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All organs and tissues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific" />
                <Label htmlFor="specific">Specific organs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="research" id="research" />
                <Label htmlFor="research">For research only</Label>
              </div>
            </RadioGroup>
            {errors.organType && <p className="text-red-500 text-sm">{errors.organType}</p>}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              required
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the terms and conditions and understand this is a legal document of gift.
            </Label>
          </div>
          {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Register
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}