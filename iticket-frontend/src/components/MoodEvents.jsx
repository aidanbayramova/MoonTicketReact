"use client"

import React from "react"
import { Sparkles, Film, Users, Heart, PartyPopper, Coffee, Mountain, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import "./MoodEvents.css"

  const moods = [
    { id: 1, mood: "Looking for energy?", icon: <Sparkles size={26} />, href: "/events/energy" },
    { id: 2, mood: "Want a relaxing time?", icon: <Film size={26} />, href: "/events/relax" },
    { id: 3, mood: "Going out with family?", icon: <Users size={26} />, href: "/events/family" },
    { id: 4, mood: "Romantic moments?", icon: <Heart size={26} />, href: "/events/love" },
    { id: 5, mood: "Fun with friends?", icon: <PartyPopper size={26} />, href: "/events/friends" },
    { id: 6, mood: "Need some calm time?", icon: <Coffee size={26} />, href: "/events/calm" },
    { id: 7, mood: "Craving adventure?", icon: <Mountain size={26} />, href: "/events/adventure" },
    { id: 8, mood: "Seeking inspiration?", icon: <Lightbulb size={26} />, href: "/events/inspiration" },
  ]
  
export default function MoodEvents() {
  return (
    <section className="mood-events py-16 px-6">
      <motion.h2 
        className="section-title text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        MOOD-BASED EVENTS
      </motion.h2>

      <motion.p 
        className="section-subtitle text-center mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
       Choose the event that suits your mood and go straight to it.
      </motion.p>

      <div className="moods-grid">
        {moods.map((m) => (
          <motion.a
            key={m.id}
            href={m.href}
            className="mood-card"
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="icon">{m.icon}</div>
            <p>{m.mood}</p>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
