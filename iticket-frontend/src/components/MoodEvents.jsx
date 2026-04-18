"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Sparkles, Film, Users, Heart,
  PartyPopper, Coffee, Mountain, Lightbulb
} from "lucide-react"
import { motion } from "framer-motion"
import "./MoodEvents.css"

export default function MoodEvents() {
  const navigate = useNavigate()

  // 🔥 Route-to-mood mapping
  const moodMap = {
    energy: ["concert", "sport"],
    relax: ["movie", "museum"],
    family: ["kids", "circus"],
    love: ["theater", "movie"],
    friends: ["concert", "sport"],
    calm: ["museum", "tourism"],
    adventure: ["tourism", "sport"],
    inspiration: ["theater", "museum"]
  }

  const moods = [
    { id: 1, key: "energy", mood: "Looking for energy?", icon: <Sparkles size={26} /> },
    { id: 2, key: "relax", mood: "Want a relaxing time?", icon: <Film size={26} /> },
    { id: 3, key: "family", mood: "Going out with family?", icon: <Users size={26} /> },
    { id: 4, key: "love", mood: "Romantic moments?", icon: <Heart size={26} /> },
    { id: 5, key: "friends", mood: "Fun with friends?", icon: <PartyPopper size={26} /> },
    { id: 6, key: "calm", mood: "Need some calm time?", icon: <Coffee size={26} /> },
    { id: 7, key: "adventure", mood: "Craving adventure?", icon: <Mountain size={26} /> },
    { id: 8, key: "inspiration", mood: "Seeking inspiration?", icon: <Lightbulb size={26} /> },
  ]

  // 🎯 RANDOM CATEGORY → ROUTE
  const handleMoodClick = (key) => {
    const selectedCategories = moodMap[key]

    if (!selectedCategories || selectedCategories.length === 0) return

    const randomCategory =
      selectedCategories[Math.floor(Math.random() * selectedCategories.length)]

    navigate(`/event/${randomCategory}`)
  }

  return (
    <section className="mood-events py-16 px-6">
      <motion.h2
        className="section-title text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        MOOD-BASED EVENTS
      </motion.h2>

      <motion.p
        className="section-subtitle text-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Choose your mood and discover perfect events 
      </motion.p>

      <div className="moods-grid">
        {moods.map((m) => (
          <motion.div
            key={m.id}
            className="mood-card"
            whileHover={{ y: -8, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodClick(m.key)}
          >
            <div className="icon">{m.icon}</div>
            <p>{m.mood}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}